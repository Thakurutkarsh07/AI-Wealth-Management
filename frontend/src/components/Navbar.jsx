import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">💼</span>
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Wealth Assistant
        </h1>
      </div>

      <div className="hidden md:flex space-x-6 text-sm font-medium">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          to="/history"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          History
        </Link>
        <Link
          to="/insights"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          Insights
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
