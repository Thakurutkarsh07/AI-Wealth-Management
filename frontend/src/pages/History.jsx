import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

Modal.setAppElement("#root");

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

function History() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(stored);
  }, []);

  const renderGraph = (graphData, type = "pie") => {
    if (!graphData || !Array.isArray(graphData) || graphData.length === 0)
      return null;

    if (type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={graphData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {graphData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white px-6 py-12">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">📜 Search History</h1>

      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelected(item)}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-xs text-gray-500 mb-1">
                {new Date(item.timestamp).toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">{item.question}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No search history yet.</p>
        )}
      </div>
    </div>

    {selected && (
      <Modal
        isOpen={!!selected}
        onRequestClose={() => setSelected(null)}
        className="bg-white rounded-xl p-8 w-full max-w-3xl mx-auto outline-none shadow-2xl relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
      >
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">{selected.question}</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">{selected.result?.summary}</p>

        {/* Chart Rendering */}
        {selected.result?.graphUrl && (
          <div className="w-full max-w-xl mx-auto mb-6">
            <img
              src={selected.result.graphUrl}
              alt="Chart"
              className="w-full h-auto rounded border shadow"
            />
          </div>
        )}

        {!selected.result?.graphUrl && selected.result?.graphData?.length > 0 && (
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={selected.result.graphData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {selected.result.graphData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Table Rendering */}
        {selected.result?.table?.headers && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm border border-collapse">
              <thead>
                <tr>
                  {selected.result.table.headers.map((h, i) => (
                    <th key={i} className="bg-gray-100 text-gray-800 font-medium border px-4 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.result.table.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {row.map((cell, j) => (
                      <td key={j} className="border px-4 py-2 text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-right mt-8">
          <button
            onClick={() => setSelected(null)}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    )}
  </div>
);

}

export default History;
