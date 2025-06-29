import React from "react";

const Layout = ({ children }) => (
<div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100">
    <main className="max-w-5xl mx-auto py-10 px-6">
      {children}
    </main>
  </div>
);

export default Layout;
