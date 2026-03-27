const express = require('express')
const cors = require('cors')
const path = require('path')
const ExcelJS = require('exceljs')
require('dotenv').config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const EXCEL_FILE = path.join(__dirname, 'BlackLion-Inventory.xlsx')

async function saveToExcel(timestamp, items) {
  const workbook = new ExcelJS.Workbook()
  let worksheet

  try {
    await workbook.xlsx.readFile(EXCEL_FILE)
    worksheet = workbook.getWorksheet('Inventory')
    if (!worksheet) {
      worksheet = workbook.addWorksheet('Inventory')
      addHeaders(worksheet)
    }
  } catch {
    worksheet = workbook.addWorksheet('Inventory')
    addHeaders(worksheet)
  }

  items.forEach(item => {
    const row = worksheet.addRow([
      timestamp,
      item.name,
      item.cat,
      item.qty,
      item.unit,
      item.status,
      item.notes || ''
    ])

    const rowColor = item.status === 'out' ? 'FFEBEE' : item.status === 'low' ? 'FFF8E1' : 'FFFFFF'
    row.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } }
      cell.alignment = { vertical: 'middle' }
    })

    const statusCell = row.getCell(6)
    statusCell.font = {
      bold: true,
      color: { argb: item.status === 'out' ? 'C62828' : item.status === 'low' ? 'F57C00' : '2E7D32' }
    }
  })

  worksheet.addRow([])
  await workbook.xlsx.writeFile(EXCEL_FILE)
}

function addHeaders(worksheet) {
  worksheet.columns = [
    { header: 'Timestamp', key: 'timestamp', width: 20 },
    { header: 'Item', key: 'name', width: 25 },
    { header: 'Category', key: 'cat', width: 15 },
    { header: 'Qty', key: 'qty', width: 10 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Notes', key: 'notes', width: 30 },
  ]

  worksheet.getRow(1).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E8B7A' } }
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })
  worksheet.getRow(1).height = 25
}

app.get('/', (req, res) => {
  res.json({ message: 'Black Lion Kitchen API is running!' })
})

app.post('/checkin', async (req, res) => {
  const { timestamp, items } = req.body

  if (!timestamp || !items) {
    return res.status(400).json({ error: 'Missing data' })
  }

  try {
    await saveToExcel(timestamp, items)
    console.log('Saved to Excel successfully')

    try {
      await fetch(process.env.APPS_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ timestamp, items })
      })
      console.log('Sent to Google Sheets')
    } catch (err) {
      console.log('Google Sheets skipped:', err.message)
    }

    res.json({ success: true, message: 'Check-in saved!' })

  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Failed to save: ' + err.message })
  }
})

app.get('/download', async (req, res) => {
  try {
    res.download(EXCEL_FILE, 'BlackLion-Inventory.xlsx')
  } catch (err) {
    res.status(404).json({ error: 'No file yet — submit a check-in first!' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})