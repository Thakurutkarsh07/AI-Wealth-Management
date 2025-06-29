import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

function ResultCard({ data }) {
  if (!data) return null;

  const { summary, graph_suggestion, table } = data;
  console.log(summary);
  
  // Prepare chart data
  let chartData = [];
  if (graph_suggestion?.labels && graph_suggestion?.values) {
    chartData = graph_suggestion.labels.map((label, i) => ({
      name: label,
      value: graph_suggestion.values[i],
    }));
  }

  return (
    <div className="mt-6">
      {summary && <p className="text-lg font-medium mb-4">{summary}</p>}

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Optional: Table if available */}
      {table?.headers && (
        <table className="w-full border text-sm text-left">
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className="border px-3 py-2 bg-gray-100 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border px-3 py-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResultCard;
