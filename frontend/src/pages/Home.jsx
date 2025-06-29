import React, { useState, useEffect } from "react";
import QueryForm from "../components/QueryForm";
import ResultCard from "../components/ResultCard";
import { queryAgent } from "../api";
import Layout from "../components/Layout";

function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frequentQueries, setFrequentQueries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const top = [...new Set(history.map((h) => h.question))].slice(0, 5);
    setFrequentQueries(top);
  }, []);

  const handleQuery = async (question) => {
    setLoading(true);
    try {
      const res = await queryAgent(question);
      const raw = res.data;

      const graphData = raw.graph_suggestion?.labels?.map((label, i) => ({
        name: label,
        value: raw.graph_suggestion.values[i],
      })) || [];

      const formattedResult = {
        summary: raw.summary,
        graphData,
        graph_suggestion: raw.graph_suggestion || null,
        table: raw.table || null,
      };

      setResult(formattedResult);

      const newEntry = {
        question,
        result: formattedResult,
        timestamp: new Date().toISOString(),
      };

      const prev = JSON.parse(localStorage.getItem("searchHistory")) || [];
      localStorage.setItem("searchHistory", JSON.stringify([newEntry, ...prev]));

      const updated = [question, ...prev.map((h) => h.question)];
      const uniqueTop = [...new Set(updated)].slice(0, 5);
      setFrequentQueries(uniqueTop);
    } catch (error) {
      console.error("Query failed:", error);
      setResult({ summary: "❌ An error occurred. Please try again." });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <main className="max-w-5xl mx-auto py-14 px-6">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🤖 AI Knowledge Query Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ask your financial or general knowledge questions and get intelligent, visual answers instantly.
          </p>
        </section>

        <QueryForm
          onQuery={handleQuery}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          frequentQueries={frequentQueries}
        />

        {loading ? (
          <div className="text-center text-gray-500 mt-12 animate-pulse text-lg">
            Processing your query... 🤖
          </div>
        ) : (
          result && (
            <section className="mt-10">
              <ResultCard data={result} />
            </section>
          )
        )}

        {frequentQueries.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span role="img" aria-label="pin">📌</span> Frequently Asked Questions
            </h2>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <ul className="divide-y divide-gray-100">
                {frequentQueries.map((query, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleQuery(query)}
                    className="py-3 px-2 cursor-pointer hover:bg-blue-50 rounded-md transition-all duration-200 flex items-center gap-2 group"
                  >
                    <svg
                      className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                      {query}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
