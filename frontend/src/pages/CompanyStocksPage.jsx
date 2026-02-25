import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client.js';
import SidebarLayout from '../components/SidebarLayout.jsx';

const CompanyStocksPage = () => {
  const { companyId } = useParams();
  const [data, setData] = useState({ company: null, stocks: [] });

  useEffect(() => {
    client.get(`/stocks/company/${companyId}`).then((res) => setData(res.data));
  }, [companyId]);

  return (
    <SidebarLayout
      title="Buyer Dashboard"
      links={[
        { to: '/buyer', label: 'Market Stocks' },
        { to: '/buyer/analysis', label: 'Profit Analysis' }
      ]}
    >
      <section className="card">
        <h2>{data.company?.companyName}</h2>
        <p><strong>Industry:</strong> {data.company?.industry}</p>
        <p>{data.company?.description}</p>
      </section>

      <section className="card">
        <h2>Company Stocks</h2>
        <table>
          <thead><tr><th>Name</th><th>Price</th><th>Available</th><th>Profit %</th></tr></thead>
          <tbody>
            {data.stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.stockName}</td>
                <td>₹{stock.stockPrice}</td>
                <td>{stock.totalStocksAvailable - stock.soldQuantity}</td>
                <td>{stock.profitPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SidebarLayout>
  );
};

export default CompanyStocksPage;
