'use client';

import { useEffect, useState } from 'react';
import ReportsChartItem from './ReportsChartItem';
import {
  getServiceDistribution,
  getMonthlySalesTrends,
  getTaskStatusDistribution,
  getClientsByCity,
  getTaskResolutionTime,
  getManagerSalesSummary,
} from '@/src/services/supabase/client/reports';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import Loading from './spiner';
import { COLORS } from '@/src/utils/serviceHelpers';

export default function ReportsCharts() {
  const [distribution, setDistribution] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [clientCityData, setClientCityData] = useState([]);
  const [resolutionData, setResolutionData] = useState([]);
  const [managerSalesData, setManagerSalesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [
        distributionData,
        salesData,
        statusData,
        cityData,
        resolutionRaw,
        managerData,
      ] = await Promise.all([
        getServiceDistribution(),
        getMonthlySalesTrends(),
        getTaskStatusDistribution(),
        getClientsByCity(),
        getTaskResolutionTime(),
        getManagerSalesSummary(),
      ]);

      // Instead of month number, display name
      const salesFormatted = salesData.map((d) => {
        const monthName = new Date(d.month + '-01').toLocaleString('lt-LT', {
          month: 'long',
        });
        return {
          ...d,
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        };
      });

      // Instead of month number, display name
      const resolutionFormatted = resolutionRaw.map((d) => {
        const monthName = new Date(d.month + '-01').toLocaleString('lt-LT', {
          month: 'long',
        });
        return {
          ...d,
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        };
      });

      // Instead of full name keep only initials
      const managerSalesFormatted = managerData.map((item) => ({
        ...item,
        manager:
          item.manager.split(' ')[0] +
          ' ' +
          item.manager.split(' ')[1][0] +
          '.',
      }));

      setDistribution(distributionData);
      setMonthlySales(salesFormatted);
      setTaskStatusData(statusData);
      setClientCityData(cityData);
      setResolutionData(resolutionFormatted);
      setManagerSalesData(managerSalesFormatted);
    }

    fetchData();
  }, []);

  const pieData = distribution
    ? [
        { name: 'Tik Internetas', value: distribution.internet },
        { name: 'Tik IPTV', value: distribution.iptv },
        { name: 'Abi paslaugos', value: distribution.combined },
        { name: 'Be paslaugų', value: distribution.noServices },
      ]
    : [];

  const SalesChartToolTip = ({ active, payload, label }) => {
    if (active && payload?.length > 0) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{label}</p>
          <p>Pratęsimų ir naujų paslaugų pardavimų: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const CityChartToolTip = ({ active, payload, label }) => {
    if (active && payload?.length > 0) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{label}</p>
          <p>Viso: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const ResolutionToolTip = ({ active, payload, label }) => {
    if (active && payload?.length > 0) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{label}</p>
          <p>
            Vidutiniškai, užduotys buvo uždarytos per{' '}
            {payload[0].value === 1
              ? 'vieną dieną'
              : `${payload[0].value} dienas`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Pie Chart for Services Distribution */}
      <ReportsChartItem title="Paslaugų pasiskirstymas (pagal klientus)">
        {distribution ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Loading />
        )}
      </ReportsChartItem>

      {/* Line Chart for sales*/}
      <ReportsChartItem title="Pardavimai pagal mėnesius">
        {monthlySales.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, dy: 10 }}
                padding={{ left: 10, right: 10 }}
              />

              <YAxis domain={[0, (dataMax) => Math.ceil(dataMax + 1)]} />
              <Tooltip content={SalesChartToolTip} />
              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Loading />
        )}
      </ReportsChartItem>

      {/* Pie Chart for Status Distribution */}
      <ReportsChartItem title="Užduočių statusai">
        {taskStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taskStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {taskStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.slug === 'open'
                        ? COLORS[1]
                        : entry.slug === 'in_progress'
                        ? COLORS[2]
                        : entry.slug === 'closed'
                        ? COLORS[3]
                        : COLORS[4]
                    }
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Loading />
        )}
      </ReportsChartItem>

      {/* Line chart for resolution time */}
      <ReportsChartItem title="Užduočių vykdymo laikas">
        {resolutionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, dy: 10 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis domain={[0, (max) => Math.ceil(max + 0.5)]} />
              <Tooltip content={ResolutionToolTip} />
              <Line
                type="monotone"
                dataKey="avg_days"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Vid. laikas (dienos)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Loading />
        )}
      </ReportsChartItem>

      {/* Bar Diagram for Cities */}
      <ReportsChartItem title="Klientai pagal miestus">
        {clientCityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={clientCityData.slice(0, 5)}>
              <XAxis dataKey="city" />
              <YAxis allowDecimals={false} />
              <Tooltip content={CityChartToolTip} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Loading />
        )}
      </ReportsChartItem>

      {/* Bar Diagram for Managers comparison */}
      <ReportsChartItem title="Vadybininkų pardavimų palyginimas">
        {managerSalesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={managerSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="manager" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="new_services"
                fill="#10B981"
                name="Naujos paslaugos"
              />
              <Bar
                dataKey="renewals"
                fill="#3B82F6"
                name="Sutarčių pratęsimai"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Loading />
        )}
      </ReportsChartItem>
    </div>
  );
}
