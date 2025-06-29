import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import InsightsPage from "./pages/InsightsPage";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
            <Layout>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<InsightsPage />} />

        </Routes>
            </Layout>

      </div>
    </Router>
  );
}

export default App;
