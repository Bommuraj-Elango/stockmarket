import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import SidebarLayout from '../components/SidebarLayout.jsx';

const BuyerDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [filters, setFilters] = useState({ companyName: '', stockName: '' });

  const loadStocks = async () => {
    const { data } = await client.get('/stocks', { params: filters });
    setStocks(data);
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const buy = async (stockId) => {
    const quantity = Number(prompt('Enter quantity to buy:'));
    if (!quantity) return;
    await client.post(`/stocks/${stockId}/buy`, { quantity });
    loadStocks();
    alert('Stock bought successfully');
  };

  return (
    <SidebarLayout
      title="Buyer Dashboard"
      links={[
        { to: '/buyer', label: 'Market Stocks' },
        { to: '/buyer/analysis', label: 'Profit Analysis' }
      ]}
    >
      <section className="card">
        <h2>Search Stocks</h2>
        <div className="grid-form two-col">
          <input placeholder="Search by Company Name" value={filters.companyName} onChange={(e) => setFilters({ ...filters, companyName: e.target.value })} />
          <input placeholder="Search by Stock Name" value={filters.stockName} onChange={(e) => setFilters({ ...filters, stockName: e.target.value })} />
          <button onClick={loadStocks}>Search</button>
        </div>
      </section>

      <section className="card">
        <h2>All Available Stocks</h2>
        <table>
          <thead><tr><th>Company</th><th>Stock</th><th>Price</th><th>Available</th><th>Profit %</th><th>Actions</th></tr></thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s._id}>
                <td>{s.company.companyName}</td>
                <td>{s.stockName}</td>
                <td>₹{s.stockPrice}</td>
                <td>{s.totalStocksAvailable - s.soldQuantity}</td>
                <td>{s.profitPercentage}</td>
                <td>
                  <Link to={`/buyer/company/${s.company._id}`}>View Company</Link>
                  <button onClick={() => buy(s._id)}>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SidebarLayout>
  );
};

export default BuyerDashboard;
