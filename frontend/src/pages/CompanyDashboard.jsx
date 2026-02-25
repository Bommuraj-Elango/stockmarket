import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import client from '../api/client.js';
import SidebarLayout from '../components/SidebarLayout.jsx';

const blankStock = { stockName: '', stockPrice: 0, totalStocksAvailable: 0, profitPercentage: 0, description: '' };

const CompanyDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState(blankStock);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [stocksRes, analyticsRes] = await Promise.all([
      client.get('/stocks/my/list'),
      client.get('/analytics/company')
    ]);
    setStocks(stocksRes.data);
    setAnalytics(analyticsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitStock = async (e) => {
    e.preventDefault();
    if (editingId) {
      await client.put(`/stocks/${editingId}`, form);
    } else {
      await client.post('/stocks', form);
    }
    setForm(blankStock);
    setEditingId(null);
    loadData();
  };

  const startEdit = (stock) => {
    setEditingId(stock._id);
    setForm(stock);
  };

  const remove = async (id) => {
    await client.delete(`/stocks/${id}`);
    loadData();
  };

  return (
    <SidebarLayout
      title="Company Dashboard"
      links={[{ to: '/company', label: 'Stocks & Revenue' }]}
    >
      <section className="card">
        <h2>{editingId ? 'Update Stock' : 'Add Stock'}</h2>
        <form className="grid-form" onSubmit={submitStock}>
          <input placeholder="Stock Name" value={form.stockName} onChange={(e) => setForm({ ...form, stockName: e.target.value })} required />
          <input type="number" placeholder="Stock Price" value={form.stockPrice} onChange={(e) => setForm({ ...form, stockPrice: Number(e.target.value) })} required />
          <input type="number" placeholder="Total Stocks Available" value={form.totalStocksAvailable} onChange={(e) => setForm({ ...form, totalStocksAvailable: Number(e.target.value) })} required />
          <input type="number" placeholder="Profit %" value={form.profitPercentage} onChange={(e) => setForm({ ...form, profitPercentage: Number(e.target.value) })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit">{editingId ? 'Save Changes' : 'Add Stock'}</button>
        </form>
      </section>

      {analytics && (
        <section className="cards-row">
          <div className="metric-card"><h3>Total Listed</h3><p>{analytics.summary.totalStocksListed}</p></div>
          <div className="metric-card"><h3>Total Sold</h3><p>{analytics.summary.totalStocksSold}</p></div>
          <div className="metric-card"><h3>Remaining</h3><p>{analytics.summary.remainingStocks}</p></div>
          <div className="metric-card"><h3>Revenue</h3><p>₹{analytics.summary.revenueGenerated.toFixed(2)}</p></div>
        </section>
      )}

      <section className="card chart-card">
        <h2>Revenue Growth</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={analytics?.trend || []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2b7fff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2b7fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="period" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#2b7fff" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="card">
        <h2>Managed Stocks</h2>
        <table>
          <thead><tr><th>Name</th><th>Price</th><th>Total</th><th>Sold</th><th>Remaining</th><th>Actions</th></tr></thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s._id}>
                <td>{s.stockName}</td>
                <td>₹{s.stockPrice}</td>
                <td>{s.totalStocksAvailable}</td>
                <td>{s.soldQuantity}</td>
                <td>{s.remainingStocks}</td>
                <td>
                  <button onClick={() => startEdit(s)}>Edit</button>
                  <button className="danger" onClick={() => remove(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SidebarLayout>
  );
};

export default CompanyDashboard;
