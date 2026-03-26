import { useState } from 'react'
import './App.css'

const INIT_ITEMS = [
  // PROTEINS
  { id:1, name:'Eggs', cat:'Proteins', qty:24, threshold:5, unit:'ct', notes:'' },
  { id:1, name:'Eggs Cracked', cat:'Proteins', qty:12, threshold:3, unit:'ct', notes:'' },
  { id:2, name:'Turkey Sausage', cat:'Proteins', qty:1, threshold:1, unit:'case', notes:'' },
  { id:3, name:'Chicken Breast', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:4, name:'Chicken Tenders', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:5, name:'Beef Patties', cat:'Proteins', qty:16, threshold:5, unit:'bags', notes:'' },
  { id:6, name:'Corned Beef', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:7, name:'Roast Beef', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:8, name:'Ham', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:9, name:'Pastrami', cat:'Proteins', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:10, name:'Smoked Salmon', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:11, name:'Tofu', cat:'Proteins', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:12, name:'Tuna', cat:'Proteins', qty:6, threshold:2, unit:'cans', notes:'' },

  // DAIRY
  { id:13, name:'Cheddar Cheese', cat:'Dairy', qty:2, threshold:1, unit:'loaf', notes:'' },
  { id:14, name:'Swiss Cheese', cat:'Dairy', qty:2, threshold:1, unit:'loaf', notes:'' },
  { id:15, name:'Havarti Cheese', cat:'Dairy', qty:2, threshold:1, unit:'loaf', notes:'' },
  { id:16, name:'Plain Yogurt', cat:'Dairy', qty:2, threshold:1, unit:'qt', notes:'' },
  { id:17, name:'Parmesan Cheese', cat:'Dairy', qty:2, threshold:1, unit:'bag', notes:'' },
  { id:18, name:'Cottage Cheese', cat:'Dairy', qty:2, threshold:1, unit:'bag', notes:'' },
  { id:19, name:'Cream Cheese', cat:'Dairy', qty:24, threshold:5, unit:'ct', notes:'' },
  { id:20, name:'Butter', cat:'Dairy', qty:24, threshold:5, unit:'ct', notes:'' },

  // VEGETABLES & PRODUCE
  { id:21, name:'Romaine Lettuce', cat:'Produce', qty:6, threshold:2, unit:'heads', notes:'' },
  { id:22, name:'Mixed Lettuce', cat:'Produce', qty:0, threshold:2, unit:'bags', notes:'' },
  { id:23, name:'Spinach', cat:'Produce', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:24, name:'Tomatoes', cat:'Produce', qty:12, threshold:3, unit:'ct', notes:'' },
  { id:25, name:'Cherry Tomatoes', cat:'Produce', qty:4, threshold:1, unit:'pints', notes:'' },
  { id:26, name:'Cucumber', cat:'Produce', qty:4, threshold:1, unit:'ct', notes:'' },
  { id:27, name:'Onion', cat:'Produce', qty:12, threshold:3, unit:'ct', notes:'' },
  { id:28, name:'Bell Peppers', cat:'Produce', qty:4, threshold:1, unit:'bags', notes:'' },
  { id:29, name:'Mushrooms', cat:'Produce', qty:0, threshold:2, unit:'lbs', notes:'' },
  { id:30, name:'Shredded Carrots', cat:'Produce', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:31, name:'Red Cabbage', cat:'Produce', qty:2, threshold:1, unit:'heads', notes:'' },
  { id:32, name:'Green Cabbage', cat:'Produce', qty:0, threshold:1, unit:'heads', notes:'' },
  { id:33, name:'Celery', cat:'Produce', qty:2, threshold:1, unit:'bunches', notes:'' },
  { id:34, name:'Parsley', cat:'Produce', qty:2, threshold:1, unit:'bunches', notes:'' },
  { id:35, name:'Mint', cat:'Produce', qty:2, threshold:1, unit:'bunches', notes:'' },
  { id:36, name:'Avocado', cat:'Produce', qty:30, threshold:5, unit:'ct', notes:'' },
  { id:37, name:'Grapes', cat:'Produce', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:38, name:'Sweet Corn', cat:'Produce', qty:12, threshold:4, unit:'cans', notes:'' },
  { id:39, name:'Kidney Beans', cat:'Produce', qty:12, threshold:2, unit:'cans', notes:'' },
  { id:40, name:'Garbanzo Beans', cat:'Produce', qty:12, threshold:2, unit:'cans', notes:'' },

  // GRAINS & DRY GOODS
  { id:41, name:'Quinoa', cat:'Grains', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:42, name:'Couscous', cat:'Grains', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:43, name:'Cracked Oats', cat:'Grains', qty:4, threshold:1, unit:'bags', notes:'' },
  { id:44, name:'Flaxseed', cat:'Grains', qty:2, threshold:1, unit:'lbs', notes:'' },
  { id:45, name:'Berbere Spice', cat:'Grains', qty:2, threshold:1, unit:'bags', notes:'' },
  { id:46, name:'Sesame Seeds', cat:'Grains', qty:2, threshold:1, unit:'lbs', notes:'' },

  // SAUCES, CONDIMENTS & OTHERS
  { id:47, name:'Mayonnaise', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:48, name:'BBQ Sauce', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:49, name:'Carolina Sauce', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:50, name:'Caesar Dressing', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:51, name:'Thousand Island', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:52, name:'Honey Dijon', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:53, name:'Sriracha', cat:'Sauces', qty:5, threshold:1, unit:'bottles', notes:'' },
  { id:54, name:'Blend Oil', cat:'Sauces', qty:2, threshold:1, unit:'gal', notes:'' },
  { id:55, name:'Sesame Oil', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:56, name:'Ketchup', cat:'Sauces', qty:12, threshold:2, unit:'bottles', notes:'' },
  { id:57, name:'Hot Sauce', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:60, name:'Rosemary', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:61, name:'Italian Seasoning', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:62, name:'Koseret', cat:'Sauces', qty:2, threshold:1, unit:'jars', notes:'' },
  { id:63, name:'Pepper', cat:'Sauces', qty:3, threshold:1, unit:'lbs', notes:'' },
  { id:64, name:'Salt', cat:'Sauces', qty:3, threshold:1, unit:'lbs', notes:'' },
  { id:65, name:'Honey', cat:'Sauces', qty:2, threshold:1, unit:'bottles', notes:'' },
  { id:66, name:'Oil Spray', cat:'Sauces', qty:4, threshold:1, unit:'cans', notes:'' },
  { id:67, name:'Lighter', cat:'Sauces', qty:4, threshold:1, unit:'ct', notes:'' },

  // BAKERY
  { id:68, name:'Croissants', cat:'Bakery', qty:15, threshold:5, unit:'ct', notes:'' },
  { id:69, name:'Rye Bread', cat:'Bakery', qty:5, threshold:2, unit:'loaves', notes:'' },
  { id:70, name:'Wheat Bread', cat:'Bakery', qty:10, threshold:2, unit:'loaves', notes:'' },
  { id:71, name:'Texas Toast', cat:'Bakery', qty:6, threshold:2, unit:'loaves', notes:'' },
  { id:72, name:'Burger Buns', cat:'Bakery', qty:4, threshold:2, unit:'bags', notes:'' },
  { id:73, name:'Tortillas', cat:'Bakery', qty:6, threshold:2, unit:'bags', notes:'' },
  { id:74, name:'Hash Browns', cat:'Bakery', qty:6, threshold:5, unit:'boxes', notes:'' },
  { id:75, name:'French Fries', cat:'Bakery', qty:30, threshold:6, unit:'lbs', notes:'' },
  { id:76, name:'Pancake Mix', cat:'Bakery', qty:6, threshold:2, unit:'bags', notes:'' },
]

const CATS = ['All','Proteins','Dairy','Produce','Grains','Sauces','Bakery']

function getStatus(item) {
  if (item.qty === 0) return 'out'
  if (item.qty < item.threshold) return 'low'
  return 'ok'
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
    const res = await fetch('http://localhost:3001/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (data.success) {
      showToast('Check-in saved to Excel + Google Sheets!')
    } else {
      showToast('Error: ' + data.error)
    }
  } catch (err) {
    showToast('Cannot reach server — is backend running?')
  }
  setLoading(false)
}

  function exportCSV() {
    const rows = [['Item','Category','Qty','Unit','Threshold','Status','Notes']]
    items.forEach(i => rows.push([i.name,i.cat,i.qty,i.unit,i.threshold,getStatus(i),i.notes]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'black-lion-' + new Date().toISOString().slice(0,10) + '.csv'
    a.click()
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
        <button className="btn secondary" onClick={exportCSV}>Export CSV</button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}