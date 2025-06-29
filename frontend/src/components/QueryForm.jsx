import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function QueryForm({
  onQuery,
  suggestions = [],
  setSuggestions = () => {},
  frequentQueries = [],
}) {

  const [question, setQuestion] = useState("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

 const handleChange = (e) => {
  const value = e.target.value || "";
  setQuestion(value);

  if (value.length > 1 && Array.isArray(frequentQueries)) {
    const filtered = frequentQueries.filter((q) =>
      q.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  } else {
    setSuggestions([]);
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    onQuery(question.trim());
    setSuggestions([]);
    resetTranscript();
  };

  const handleSuggestionClick = (text) => {
    setQuestion(text);
    onQuery(text);
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask a financial question..."
          value={question}
          onChange={handleChange}
        />
        <button
          type="button"
          className="bg-blue-100 px-3 py-2 rounded hover:bg-blue-200 text-blue-700"
          onClick={() => {
            SpeechRecognition.startListening({ continuous: false });
          }}
        >
          🎙️
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded w-full mt-1 z-10 max-h-40 overflow-auto shadow">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {listening && <p className="text-sm text-blue-600 mt-1">🎧 Listening...</p>}
    </form>
  );
}

export default QueryForm;
