const express = require('express')
const cors = require('cors')
const path = require('path')
const ExcelJS = require('exceljs')
require('dotenv').config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Desktop path
const DESKTOP = path.join('C:\\Users\\Chef Nek\\Desktop')
const EXCEL_FILE = path.join(DESKTOP, 'BlackLion-Inventory.xlsx')

async function saveToExcel(timestamp, items) {
  const workbook = new ExcelJS.Workbook()
  let worksheet

  // Try to load existing file, otherwise create new
  try {
    await workbook.xlsx.readFile(EXCEL_FILE)
    worksheet = workbook.getWorksheet('Inventory')
  } catch {
    worksheet = workbook.addWorksheet('Inventory')

    // Add headers with styling
    worksheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 20 },
      { header: 'Item', key: 'name', width: 25 },
      { header: 'Category', key: 'cat', width: 15 },
      { header: 'Qty', key: 'qty', width: 10 },
      { header: 'Unit', key: 'unit', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Notes', key: 'notes', width: 30 },
    ]

    // Style the header row
    worksheet.getRow(1).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E8B7A' } }
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
    worksheet.getRow(1).height = 25
  }

  // Add data rows
  items.forEach((item, index) => {
    const row = worksheet.addRow({
      timestamp,
      name: item.name,
      cat: item.cat,
      qty: item.qty,
      unit: item.unit,
      status: item.status,
      notes: item.notes || ''
    })

    // Color rows by status
    const rowColor = item.status === 'out' ? 'FFEBEE' : item.status === 'low' ? 'FFF8E1' : 'FFFFFF'
    row.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } }
      cell.alignment = { vertical: 'middle' }
    })

    // Color status cell
    const statusCell = row.getCell('status')
    statusCell.font = {
      bold: true,
      color: { argb: item.status === 'out' ? 'C62828' : item.status === 'low' ? 'F57C00' : '2E7D32' }
    }
  })

  // Add empty row between check-ins
  worksheet.addRow({})

  await workbook.xlsx.writeFile(EXCEL_FILE)
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
    // Save to Excel
    await saveToExcel(timestamp, items)
    console.log('Saved to Excel:', EXCEL_FILE)

    // Also send to Google Sheets
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

    res.json({ success: true, message: 'Check-in saved to Excel and Google Sheets!' })

  } catch (err) {
    console.error('Excel error:', err.message)
    res.status(500).json({ error: 'Failed to save: ' + err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})