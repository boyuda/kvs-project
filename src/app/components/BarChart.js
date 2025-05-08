'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useEffect, useState } from 'react';
import { getUserSalesByMonth } from '@/src/services/supabase/client/sales';

const BarChartComponent = ({ userId }) => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (userId) {
      getUserSalesByMonth(userId).then(setSalesData);
    }
  }, [userId]);

  return (
    <div className=" rounded-xl w-full h-full p-4 shadow-md border-2">
      {/* Title */}
      <div className="flex justify-center items-center">
        <h1 className="text-texts text-lg font-semibold">
          Metų Pardavimų Rezultatai
        </h1>
      </div>

      {/* Chart */}
      <div className="w-full h-[80%] mt-4">
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={salesData}
            margin={{
              right: 30,
            }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 11, textAnchor: 'end' }}
              className="text-texts font-semibold"
            />
            <YAxis
              className="text-texts font-semibold"
              allowDecimals={false}
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="sutarciu_pratesimai"
              fill="#3B82F6"
              name="Pratęstos sutartys"
            />
            <Bar
              dataKey="naujos_paslaugos"
              fill="#10B981"
              name="Sudarytos naujos sutartys"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Bottom */}
      <div className="flex justify-center gap-16 text-texts font-semibold">
        <div className="flex  gap-1 justify-center items-center">
          <div className="w-5 h-5 bg-primary rounded-full" />
          <h1 className="text-xs">Pratęstos sutartys </h1>
        </div>
        <div className="flex  gap-1 justify-center items-center">
          <div className="w-5 h-5 bg-secondary rounded-full" />
          <h1 className="text-xs">Sudarytos naujos sutartys </h1>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-foreground  rounded-md">
        <p className="text-white">{label}</p>
        <p className="text-sm text-primary">
          Sutarčių pratęsimai:
          <span> {payload[0].value}</span>
        </p>
        <p className="text-sm text-secondary">
          Naujų paslaugų pardavimas:
          <span> {payload[1].value}</span>
        </p>
      </div>
    );
  }
};
