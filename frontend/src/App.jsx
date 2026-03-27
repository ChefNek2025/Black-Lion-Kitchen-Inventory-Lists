import { useState } from 'react'
import XLSX from 'xlsx-js-style'
import './App.css'

const INIT_ITEMS = [
  { id:1, name:'Eggs', cat:'Proteins', qty:24, threshold:5, unit:'ct', notes:'' },
  { id:2, name:'Eggs Cracked', cat:'Proteins', qty:12, threshold:3, unit:'ct', notes:'' },
  { id:3, name:'Turkey Sausage', cat:'Proteins', qty:1, threshold:1, unit:'case', notes:'' },
  { id:4, name:'Chicken Breast', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:5, name:'Chicken Tenders', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:6, name:'Beef Patties', cat:'Proteins', qty:16, threshold:5, unit:'bags', notes:'' },
  { id:7, name:'Corned Beef', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:8, name:'Roast Beef', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:9, name:'Ham', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:10, name:'Pastrami', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:11, name:'Smoked Salmon', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:12, name:'Tofu', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:13, name:'Tuna', cat:'Proteins', qty:6, threshold:2, unit:'cans', notes:'' },
  { id:14, name:'Cheddar Cheese', cat:'Dairy', qty:2, threshold:1, unit:'loaf', notes:'' },
  { id:15, name:'Swiss Cheese', cat:'Dairy', qty:2, threshold:1, unit:'loaf', notes:'' },
  { id:16, name:'Havarti Cheese', cat:'Dairy', qty:2, threshold:1, unit:'loaf', notes:'' },
  { id:17, name:'Plain Yogurt', cat:'Dairy', qty:2, threshold:1, unit:'qt', notes:'' },
  { id:18, name:'Parmesan Cheese', cat:'Dairy', qty:2, threshold:1, unit:'bag', notes:'' },
  { id:19, name:'Cottage Cheese', cat:'Dairy', qty:2, threshold:1, unit:'bag', notes:'' },
  { id:20, name:'Cream Cheese', cat:'Dairy', qty:24, threshold:5, unit:'ct', notes:'' },
  { id:21, name:'Butter', cat:'Dairy', qty:24, threshold:5, unit:'ct', notes:'' },
  { id:22, name:'Romaine Lettuce', cat:'Produce', qty:6, threshold:2, unit:'heads', notes:'' },
  { id:23, name:'Mixed Lettuce', cat:'Produce', qty:0, threshold:2, unit:'bags', notes:'' },
  { id:24, name:'Spinach', cat:'Produce', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:25, name:'Tomatoes', cat:'Produce', qty:12, threshold:3, unit:'ct', notes:'' },
  { id:26, name:'Cherry Tomatoes', cat:'Produce', qty:4, threshold:1, unit:'pints', notes:'' },
  { id:27, name:'Cucumber', cat:'Produce', qty:4, threshold:1, unit:'ct', notes:'' },
  { id:28, name:'Onion', cat:'Produce', qty:12, threshold:3, unit:'ct', notes:'' },
  { id:29, name:'Bell Peppers', cat:'Produce', qty:4, threshold:1, unit:'bags', notes:'' },
  { id:30, name:'Mushrooms', cat:'Produce', qty:0, threshold:2, unit:'lbs', notes:'' },
  { id:31, name:'Shredded Carrots', cat:'Produce', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:32, name:'Red Cabbage', cat:'Produce', qty:2, threshold:1, unit:'heads', notes:'' },
  { id:33, name:'Green Cabbage', cat:'Produce', qty:0, threshold:1, unit:'heads', notes:'' },
  { id:34, name:'Celery', cat:'Produce', qty:2, threshold:1, unit:'bunches', notes:'' },
  { id:35, name:'Parsley', cat:'Produce', qty:2, threshold:1, unit:'bunches', notes:'' },
  { id:36, name:'Mint', cat:'Produce', qty:2, threshold:1, unit:'bunches', notes:'' },
  { id:37, name:'Avocado', cat:'Produce', qty:30, threshold:5, unit:'ct', notes:'' },
  { id:38, name:'Grapes', cat:'Produce', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:39, name:'Sweet Corn', cat:'Produce', qty:12, threshold:4, unit:'cans', notes:'' },
  { id:40, name:'Kidney Beans', cat:'Produce', qty:12, threshold:2, unit:'cans', notes:'' },
  { id:41, name:'Garbanzo Beans', cat:'Produce', qty:12, threshold:2, unit:'cans', notes:'' },
  { id:42, name:'Quinoa', cat:'Grains', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:43, name:'Couscous', cat:'Grains', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:44, name:'Cracked Oats', cat:'Grains', qty:4, threshold:1, unit:'bags', notes:'' },
  { id:45, name:'Flaxseed', cat:'Grains', qty:2, threshold:1, unit:'lbs', notes:'' },
  { id:46, name:'Berbere Spice', cat:'Grains', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:47, name:'Sesame Seeds', cat:'Grains', qty:2, threshold:1, unit:'lbs', notes:'' },
  { id:48, name:'Mayonnaise', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:49, name:'BBQ Sauce', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:50, name:'Carolina Sauce', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:51, name:'Caesar Dressing', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:52, name:'Thousand Island', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:53, name:'Honey Dijon', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:54, name:'Sriracha', cat:'Sauces', qty:5, threshold:1, unit:'bottles', notes:'' },
  { id:55, name:'Blend Oil', cat:'Sauces', qty:2, threshold:1, unit:'gal', notes:'' },
  { id:56, name:'Sesame Oil', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:57, name:'Ketchup', cat:'Sauces', qty:12, threshold:2, unit:'bottles', notes:'' },
  { id:58, name:'Hot Sauce', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:59, name:'Rosemary', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:60, name:'Italian Seasoning', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:61, name:'Koseret', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:62, name:'Pepper', cat:'Sauces', qty:3, threshold:1, unit:'lbs', notes:'' },
  { id:63, name:'Salt', cat:'Sauces', qty:3, threshold:1, unit:'lbs', notes:'' },
  { id:64, name:'Honey', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:65, name:'Oil Spray', cat:'Sauces', qty:4, threshold:1, unit:'cans', notes:'' },
  { id:66, name:'Lighter', cat:'Sauces', qty:4, threshold:1, unit:'ct', notes:'' },
  { id:67, name:'Croissants', cat:'Bakery', qty:15, threshold:5, unit:'ct', notes:'' },
  { id:68, name:'Rye Bread', cat:'Bakery', qty:5, threshold:2, unit:'loaves', notes:'' },
  { id:69, name:'Wheat Bread', cat:'Bakery', qty:10, threshold:2, unit:'loaves', notes:'' },
  { id:70, name:'Texas Toast', cat:'Bakery', qty:6, threshold:2, unit:'loaves', notes:'' },
  { id:71, name:'Burger Buns', cat:'Bakery', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:72, name:'Tortillas', cat:'Bakery', qty:6, threshold:2, unit:'bags', notes:'' },
  { id:73, name:'Hash Browns', cat:'Bakery', qty:6, threshold:5, unit:'boxes', notes:'' },
  { id:74, name:'French Fries', cat:'Bakery', qty:30, threshold:6, unit:'lbs', notes:'' },
  { id:75, name:'Pancake Mix', cat:'Bakery', qty:6, threshold:2, unit:'bags', notes:'' },
]

const CATS = ['All','Proteins','Dairy','Produce','Grains','Sauces','Bakery']

function getStatus(item) {
  if (item.qty === 0) return 'out'
  if (item.qty < item.threshold) return 'low'
  return 'ok'
}

const catColors = {
  'Proteins': 'FCE4EC',
  'Dairy':    'E3F2FD',
  'Produce':  'E8F5E9',
  'Grains':   'FFF8E1',
  'Sauces':   'F3E5F5',
  'Bakery':   'FBE9E7',
}

const statusColors = {
  'ok':  { bg: 'E8F5E9', font: '2E7D32' },
  'low': { bg: 'FFF8E1', font: 'F57C00' },
  'out': { bg: 'FFEBEE', font: 'C62828' },
}

export default function App() {
  const [items, setItems] = useState(INIT_ITEMS)
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const visible = items
    .filter(i => filter === 'All' || i.cat === filter)
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  const low = items.filter(i => getStatus(i) === 'low').length
  const out = items.filter(i => getStatus(i) === 'out').length
  const ok = items.length - low - out

  function updateQty(id, val) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, parseInt(val) || 0) } : i))
  }

  function updateNotes(id, val) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes: val } : i))
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function submitCheckin() {
    setLoading(true)
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    })
    const payload = {
      timestamp,
      items: items.map(i => ({ ...i, status: getStatus(i) }))
    }
    try {
      const res = await fetch('https://black-lion-kitchen-inventory-lists.onrender.com/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        showToast('Check-in saved to Google Sheets!')
      } else {
        showToast('Error: ' + data.error)
      }
    } catch (err) {
      showToast('Cannot reach server — is backend running?')
    }
    setLoading(false)
  }

  function exportExcel() {
    const wb = XLSX.utils.book_new()
    const wsData = []

    const hStyle = (bg) => ({ s: { fill: { fgColor: { rgb: bg } }, font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' } } })
    const cStyle = (bg) => ({ s: { fill: { fgColor: { rgb: bg } }, font: { bold: true } } })
    const dStyle = (bg) => ({ s: { fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'center' } } })

    wsData.push([
      { v: 'BLACK LION KITCHEN — INVENTORY LIST', ...hStyle('1A1A1A') },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
    ])

    wsData.push([
      { v: 'Date: ' + new Date().toLocaleString(), ...hStyle('2E8B7A') },
      { v: '', s: { fill: { fgColor: { rgb: '2E8B7A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '2E8B7A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '2E8B7A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '2E8B7A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '2E8B7A' } } } },
      { v: '', s: { fill: { fgColor: { rgb: '2E8B7A' } } } },
    ])

    wsData.push([])

    wsData.push(['Item','Category','Qty','Unit','Min','Status','Notes'].map(h => ({
      v: h, ...hStyle('2E8B7A')
    })))

    const cats = ['Proteins','Dairy','Produce','Grains','Sauces','Bakery']
    cats.forEach(cat => {
      const catItems = items.filter(i => i.cat === cat)
      if (catItems.length === 0) return
      const cc = catColors[cat]

      wsData.push([
        { v: cat.toUpperCase(), ...cStyle(cc) },
        { v: '', s: { fill: { fgColor: { rgb: cc } } } },
        { v: '', s: { fill: { fgColor: { rgb: cc } } } },
        { v: '', s: { fill: { fgColor: { rgb: cc } } } },
        { v: '', s: { fill: { fgColor: { rgb: cc } } } },
        { v: '', s: { fill: { fgColor: { rgb: cc } } } },
        { v: '', s: { fill: { fgColor: { rgb: cc } } } },
      ])

      catItems.forEach((item, idx) => {
        const sc = statusColors[getStatus(item)]
        const bg = idx % 2 === 0 ? 'FFFFFF' : 'F5F5F5'
        wsData.push([
          { v: item.name, s: { fill: { fgColor: { rgb: bg } } } },
          { v: item.cat, s: { fill: { fgColor: { rgb: bg } } } },
          { v: item.qty, ...dStyle(bg) },
          { v: item.unit, ...dStyle(bg) },
          { v: item.threshold, ...dStyle(bg) },
          { v: getStatus(item).toUpperCase(), s: { fill: { fgColor: { rgb: sc.bg } }, font: { bold: true, color: { rgb: sc.font } }, alignment: { horizontal: 'center' } } },
          { v: item.notes || '', s: { fill: { fgColor: { rgb: bg } } } },
        ])
      })
      wsData.push([])
    })

    wsData.push([
      { v: 'TOTAL: ' + items.length, s: { fill: { fgColor: { rgb: '1A1A1A' } }, font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: 'IN STOCK: ' + ok, s: { fill: { fgColor: { rgb: '1A1A1A' } }, font: { bold: true, color: { rgb: '4CAF50' } }, alignment: { horizontal: 'center' } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: 'LOW: ' + low, s: { fill: { fgColor: { rgb: '1A1A1A' } }, font: { bold: true, color: { rgb: 'FF9800' } }, alignment: { horizontal: 'center' } } },
      { v: '', s: { fill: { fgColor: { rgb: '1A1A1A' } } } },
      { v: 'OUT: ' + out, s: { fill: { fgColor: { rgb: '1A1A1A' } }, font: { bold: true, color: { rgb: 'F44336' } }, alignment: { horizontal: 'center' } } },
    ])

    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
    XLSX.writeFile(wb, 'BlackLion-Inventory-' + new Date().toISOString().slice(0,10) + '.xlsx')
  }

  return (
    <div className="app">
      <div className="header">
        <div className="logo"><span>Black Lion</span> Inventory List</div>
        <div className="timestamp">{new Date().toLocaleString()}</div>
      </div>

      <div className="summary-bar">
        <div className="summary-item">Total items: <span>{items.length}</span></div>
        <div className="summary-item">In stock: <span>{ok}</span></div>
        <div className="summary-item">Low stock: <span>{low}</span></div>
        <div className="summary-item">Out of stock: <span>{out}</span></div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-label">Total items</div><div className="stat-value">{items.length}</div></div>
        <div className="stat"><div className="stat-label">In stock</div><div className="stat-value ok">{ok}</div></div>
        <div className="stat"><div className="stat-label">Low stock</div><div className="stat-value warn">{low}</div></div>
        <div className="stat"><div className="stat-label">Out of stock</div><div className="stat-value danger">{out}</div></div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      <div className="filter-bar">
        {CATS.map(c => (
          <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div>Item</div><div>Qty</div><div>Min</div><div>Status</div><div>Notes</div>
        </div>
        {visible.map(item => {
          const s = getStatus(item)
          return (
            <div key={item.id} className={`row ${s !== 'ok' ? s : ''}`}>
              <div>
                <div className="item-name">{item.name}</div>
                <div className={`item-cat cat-${item.cat}`}>{item.cat} · {item.unit}</div>
              </div>
              <div>
                <input className="qty-input" type="number" min="0" value={item.qty}
                  onChange={e => updateQty(item.id, e.target.value)} />
              </div>
              <div className="threshold">{item.threshold}</div>
              <div><span className={`badge ${s}`}>{s === 'ok' ? 'OK' : s === 'low' ? 'Low' : 'Out'}</span></div>
              <div>
                <input className="notes-input" placeholder="Add note…" value={item.notes}
                  onChange={e => updateNotes(item.id, e.target.value)} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="actions">
        <button className="btn primary" onClick={submitCheckin} disabled={loading}>
          {loading ? 'Saving...' : 'Submit Check-in'}
        </button>
        <button className="btn secondary" onClick={exportExcel}>Download Excel</button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
