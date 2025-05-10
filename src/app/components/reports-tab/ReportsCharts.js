'use client';
import { useEffect, useState } from 'react';
import ReportsChartItem from './ReportsChartItem';
import { getServiceDistribution } from '@/src/services/supabase/client/reports';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsCharts() {
  const [distribution, setDistribution] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getServiceDistribution();
      setDistribution(data);
    }

    fetchData();
  }, []);

  const chartData = distribution
    ? [
        { name: 'Tik Internetas', value: distribution.internet },
        { name: 'Tik IPTV', value: distribution.iptv },
        { name: 'Abi paslaugos', value: distribution.combined },
        { name: 'Be paslaugų', value: distribution.noServices },
      ]
    : [];

  const COLORS = ['#3B82F6', '#10B981', '#93C5FD', '#DC2626'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ReportsChartItem title="Paslaugų pasiskirstymas (pagal klientus)">
        {distribution ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="p-4">Kraunama...</div>
        )}
      </ReportsChartItem>
      <ReportsChartItem title="Paslaugų pasiskirstymas (pagal klientus)">
        {distribution ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="p-4">Kraunama...</div>
        )}
      </ReportsChartItem>
      <ReportsChartItem title="Paslaugų pasiskirstymas (pagal klientus)">
        {distribution ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="p-4">Kraunama...</div>
        )}
      </ReportsChartItem>
    </div>
  );
}
