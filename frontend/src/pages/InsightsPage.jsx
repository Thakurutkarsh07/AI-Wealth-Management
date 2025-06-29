import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Modal Component
const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-5xl mx-4 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const Graph = ({ data, type }) => {
  if (!data || !data.labels?.length || !data.values?.length) {
    return <p className="text-gray-400 text-sm">No graph data available.</p>;
  }

  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      {type === "pie" ? (
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
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      ) : (
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#374151" />
          <YAxis stroke="#374151" />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

const Insights = () => {
  const [historical, setHistorical] = useState(() => {
    try {
      const raw = localStorage.getItem("searchHistory");
      if (!raw) return {};

      const parsed = JSON.parse(raw);
      const data = {};

      parsed.forEach((entry) => {
        const { question, result } = entry;
        const g = result.graph_suggestion;
        if (g && g.labels && g.values) {
          data[question] = {
            ...g,
            type: g.type || "bar",
          };
        }
      });

      return data;
    } catch (e) {
      console.error("Failed to parse history:", e);
      return {};
    }
  });

  const [llm, setLlm] = useState({});
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [llmLoading, setLlmLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/insights").then((res) => {
      const { llm } = res.data;
      setLlm(llm);
      setLlmLoading(false);
    });
  }, []);

  const historicalEntries = Object.entries(historical);
  const shownHistorical =
    historicalEntries.length > 3
      ? historicalEntries.sort(() => 0.5 - Math.random()).slice(0, 3)
      : historicalEntries;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-900">
        📈 Insights Dashboard
      </h1>

      {/* Historical Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
          🔁 Historical Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {shownHistorical.map(([question, graphData], i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-md transition hover:shadow-lg cursor-pointer"
              onClick={() =>
                setSelectedGraph({
                  component: (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {question}
                      </h3>
                      <Graph data={graphData} type={graphData.type} />
                    </>
                  ),
                })
              }
            >
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                {question}
              </h3>
              <Graph data={graphData} type={graphData.type} />
            </div>
          ))}
        </div>
      </section>

      {/* LLM Insights Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
          🧠 AI-Generated Insights
        </h2>

        {llmLoading ? (
          <div className="text-center mt-10 text-gray-500 text-sm animate-pulse">
            🤖 Generating AI insights...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(llm).map(([question, res], i) => {
              const fullComponent = (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {question}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{res.summary}</p>
                  {res.graph_url ? (
                    <img
                      src={res.graph_url}
                      alt="Graph"
                      className="w-full h-auto rounded-lg border border-gray-200 shadow-sm mb-3"
                    />
                  ) : (
                    <Graph
                      data={res.graph_suggestion}
                      type={res.graph_suggestion?.type || "bar"}
                    />
                  )}
                  {res.table?.headers?.length > 0 && (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full border border-gray-200 text-xs rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            {res.table.headers.map((h, idx) => (
                              <th
                                key={idx}
                                className="px-3 py-2 border-b text-gray-600 text-left"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {res.table.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className="px-3 py-2 border-b text-gray-700 whitespace-nowrap"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              );

              return (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl shadow-md transition hover:shadow-lg flex flex-col cursor-pointer"
                  onClick={() => setSelectedGraph({ component: fullComponent })}
                >
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {question}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{res.summary}</p>
                  {res.graph_url ? (
                    <img
                      src={res.graph_url}
                      alt="Graph"
                      className="w-full h-auto rounded-lg border border-gray-200 shadow-sm mb-3"
                    />
                  ) : (
                    <Graph
                      data={res.graph_suggestion}
                      type={res.graph_suggestion?.type || "bar"}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal */}
      <Modal show={!!selectedGraph} onClose={() => setSelectedGraph(null)}>
        {selectedGraph?.component}
      </Modal>
    </div>
  );
};

export default Insights;
