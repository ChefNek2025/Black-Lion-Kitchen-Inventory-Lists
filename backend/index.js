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

const CAT_COLORS = {
  'Proteins': 'FCE4EC',
  'Dairy':    'E3F2FD',
  'Produce':  'E8F5E9',
  'Grains':   'FFF8E1',
  'Sauces':   'F3E5F5',
  'Bakery':   'FBE9E7',
}

const STATUS_COLORS = {
  'ok':  { bg: 'E8F5E9', font: '2E7D32' },
  'low': { bg: 'FFF8E1', font: 'F57C00' },
  'out': { bg: 'FFEBEE', font: 'C62828' },
}

async function saveToExcel(timestamp, items) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Black Lion Kitchen'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet('Inventory', {
    views: [{ state: 'frozen', ySplit: 3 }]
  })

  // Title row
  worksheet.mergeCells('A1:G1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = 'BLACK LION KITCHEN — INVENTORY CHECK-IN'
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1A1A1A' } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  worksheet.getRow(1).height = 35

  // Timestamp row
  worksheet.mergeCells('A2:G2')
  const tsCell = worksheet.getCell('A2')
  tsCell.value = 'Date: ' + timestamp
  tsCell.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } }
  tsCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E8B7A' } }
  tsCell.alignment = { horizontal: 'center', vertical: 'middle' }
  worksheet.getRow(2).height = 25

  // Header row
  const headers = ['Item', 'Category', 'Qty', 'Unit', 'Min Stock', 'Status', 'Notes']
  const headerRow = worksheet.addRow(headers)
  headerRow.height = 25
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E8B7A' } }
    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFF' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = {
      bottom: { style: 'medium', color: { argb: '1A6B5A' } }
    }
  })

  // Set column widths
  worksheet.columns = [
    { key: 'name', width: 25 },
    { key: 'cat', width: 15 },
    { key: 'qty', width: 10 },
    { key: 'unit', width: 12 },
    { key: 'threshold', width: 12 },
    { key: 'status', width: 12 },
    { key: 'notes', width: 35 },
  ]

  // Group items by category
  const categories = ['Proteins', 'Dairy', 'Produce', 'Grains', 'Sauces', 'Bakery']
  
  categories.forEach(cat => {
    const catItems = items.filter(i => i.cat === cat)
    if (catItems.length === 0) return

    // Category header row
    const catRow = worksheet.addRow([cat.toUpperCase(), '', '', '', '', '', ''])
    worksheet.mergeCells(`A${catRow.number}:G${catRow.number}`)
    const catColor = CAT_COLORS[cat] || 'F5F5F5'
    catRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: catColor } }
    catRow.getCell(1).font = { bold: true, size: 11, color: { argb: '1A1A1A' } }
    catRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 }
    catRow.height = 20

    // Item rows
    catItems.forEach((item, index) => {
      const statusColor = STATUS_COLORS[item.status] || STATUS_COLORS['ok']
      const isEven = index % 2 === 0
      const rowBg = isEven ? 'FFFFFF' : 'F9F9F9'

      const row = worksheet.addRow([
        item.name,
        item.cat,
        item.qty,
        item.unit,
        item.threshold,
        item.status.toUpperCase(),
        item.notes || ''
      ])

      row.height = 20
      row.eachCell((cell, colNumber) => {
        // Alternating row colors
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } }
        cell.alignment = { vertical: 'middle' }
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } }
        }
      })

      // Status cell color
      const statusCell = row.getCell(6)
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusColor.bg } }
      statusCell.font = { bold: true, color: { argb: statusColor.font } }
      statusCell.alignment = { horizontal: 'center', vertical: 'middle' }

      // Qty cell - highlight if low or out
      const qtyCell = row.getCell(3)
      if (item.status !== 'ok') {
        qtyCell.font = { bold: true, color: { argb: statusColor.font } }
      }
    })
  })

  // Summary row at bottom
  const totalRow = worksheet.addRow(['', '', '', '', '', '', ''])
  worksheet.addRow([])
  const summaryRow = worksheet.addRow([
    'TOTAL ITEMS: ' + items.length,
    '',
    'IN STOCK: ' + items.filter(i => i.status === 'ok').length,
    '',
    'LOW STOCK: ' + items.filter(i => i.status === 'low').length,
    '',
    'OUT OF STOCK: ' + items.filter(i => i.status === 'out').length,
  ])
  summaryRow.height = 25
  summaryRow.eachCell(cell => {
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
  console.log(`Server running on http://localhost:${PORT}`)
})
