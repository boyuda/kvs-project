'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function SimpleBarChart() {
  return (
    <div className="rounded-xl w-full h-full p-4">
      {/* Title */}
      <div className=" flex justify-center items-center">
        <h1 className="text-lg font-semibold ">Sutarčių atnaujinimai</h1>
      </div>

      {/* Chart */}
      <div className="">
        <ResponsiveContainer width={'100%'} height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="uv"
              fill="#B3CDAD"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="pv"
              fill="#FF5F5E"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-blue-500 rounded-full">
            <h1 className="font-bold">1,234</h1>
            <h1 className="text-xs ">Data1</h1>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-green-500 rounded-full">
            <h1 className="font-bold">1,234</h1>
            <h1 className="text-xs ">Data2</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
