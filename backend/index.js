const express = require('express')
const cors = require('cors')
const path = require('path')
const ExcelJS = require('exceljs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const EXCEL_FILE = path.join(__dirname, 'BlackLion-Inventory.xlsx')

async function saveToExcel(timestamp, items) {
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Inventory')

  // Column widths
  ws.columns = [
    { width: 25 },
    { width: 15 },
    { width: 10 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 35 },
  ]

  // Title row
  ws.mergeCells('A1:G1')
  ws.getCell('A1').value = 'BLACK LION KITCHEN — INVENTORY CHECK-IN'
  ws.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFF' } }
  ws.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1A1A1A' } }
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(1).height = 35

  // Timestamp row
  ws.mergeCells('A2:G2')
  ws.getCell('A2').value = 'Date: ' + timestamp
  ws.getCell('A2').font = { bold: true, size: 12, color: { argb: 'FFFFFF' } }
  ws.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E8B7A' } }
  ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(2).height = 25

  // Header row
  const headerRow = ws.addRow(['Item', 'Category', 'Qty', 'Unit', 'Min', 'Status', 'Notes'])
  headerRow.height = 22
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E8B7A' } }
    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFF' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })

  // Category colors
  const catColors = {
    'Proteins': 'FCE4EC',
    'Dairy':    'E3F2FD',
    'Produce':  'E8F5E9',
    'Grains':   'FFF8E1',
    'Sauces':   'F3E5F5',
    'Bakery':   'FBE9E7',
  }

  // Status colors
  const statusColors = {
    'ok':  { bg: 'E8F5E9', font: '2E7D32' },
    'low': { bg: 'FFF8E1', font: 'F57C00' },
    'out': { bg: 'FFEBEE', font: 'C62828' },
  }

  // Group by category
  const cats = ['Proteins', 'Dairy', 'Produce', 'Grains', 'Sauces', 'Bakery']

  cats.forEach(cat => {
    const catItems = items.filter(i => i.cat === cat)
    if (catItems.length === 0) return

    // Category header
    const catRow = ws.addRow([cat.toUpperCase()])
    ws.mergeCells(`A${catRow.number}:G${catRow.number}`)
    catRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: catColors[cat] || 'F5F5F5' } }
    catRow.getCell(1).font = { bold: true, size: 11 }
    catRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 }
    catRow.height = 20

    // Items
    catItems.forEach((item, index) => {
      const sc = statusColors[item.status] || statusColors['ok']
      const bg = index % 2 === 0 ? 'FFFFFF' : 'F9F9F9'

      const row = ws.addRow([
        item.name,
        item.cat,
        item.qty,
        item.unit,
        item.threshold,
        item.status.toUpperCase(),
        item.notes || ''
      ])

      row.height = 20
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
        cell.alignment = { vertical: 'middle' }
        cell.border = { bottom: { style: 'thin', color: { argb: 'E0E0E0' } } }
      })

      // Status cell
      row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } }
      row.getCell(6).font = { bold: true, color: { argb: sc.font } }
      row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' }

      // Qty cell
      if (item.status !== 'ok') {
        row.getCell(3).font = { bold: true, color: { argb: sc.font } }
      }
    })
  })

  // Summary row
  ws.addRow([])
  const sumRow = ws.addRow([
    'TOTAL: ' + items.length,
    '',
    'IN STOCK: ' + items.filter(i => i.status === 'ok').length,
    '',
    'LOW: ' + items.filter(i => i.status === 'low').length,
    '',
    'OUT: ' + items.filter(i => i.status === 'out').length,
  ])
  sumRow.height = 25
  sumRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1A1A1A' } }
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })

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
  console.log(`Server running on port ${PORT}`)
})
