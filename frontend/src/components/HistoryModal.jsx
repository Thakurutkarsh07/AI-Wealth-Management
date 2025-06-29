import React from "react";

function HistoryModal({ entry, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
          aria-label="Close"
        >
          ×
        </button>

        {/* Modal Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          📊 Result for:
        </h3>
        <p className="text-blue-700 font-medium text-lg mb-4">{entry.question}</p>

        {/* Summary Section */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Summary</h4>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {entry.result.summary}
          </p>
        </div>

        {/* Optional Graph Placeholder */}
        {/* You can integrate a chart component here */}
        {/* <Graph data={entry.result.graph_suggestion} type="bar" /> */}
      </div>
    </div>
  );
}

export default HistoryModal;
