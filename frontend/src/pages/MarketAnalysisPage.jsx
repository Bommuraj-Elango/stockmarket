import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import client from '../api/client.js';
import SidebarLayout from '../components/SidebarLayout.jsx';

const MarketAnalysisPage = () => {
  const [ranking, setRanking] = useState([]);
  const [topProfitCompany, setTopProfitCompany] = useState(null);

  useEffect(() => {
    client.get('/analytics/market-ranking').then((res) => {
      setRanking(res.data.ranking);
      setTopProfitCompany(res.data.topProfitCompany);
    });
  }, []);

  return (
    <SidebarLayout
      title="Buyer Dashboard"
      links={[
        { to: '/buyer', label: 'Market Stocks' },
        { to: '/buyer/analysis', label: 'Profit Analysis' }
      ]}
    >
      <section className="cards-row">
        <div className="metric-card wide">
          <h3>Highest Profit Company</h3>
          <p>{topProfitCompany?.companyName || 'N/A'}</p>
          <small>{topProfitCompany ? `${topProfitCompany.avgProfitPercentage?.toFixed(2)}% avg profit` : ''}</small>
        </div>
      </section>

      <section className="card chart-card">
        <h2>Revenue Ranking (Bar)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ranking}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="companyName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenueGenerated" fill="#2b7fff" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="card chart-card">
        <h2>Profit Percentage Trend (Line)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ranking}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="companyName" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgProfitPercentage" stroke="#00b894" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="card chart-card">
        <h2>Revenue Share (Pie)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={ranking} dataKey="revenueGenerated" nameKey="companyName" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </SidebarLayout>
  );
};

export default MarketAnalysisPage;
