import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Transactions from "./pages/Transactions"; // Import the new page

// Temporary placeholders for the new pages 
// (You can later move these to actual files in /pages)
import HoldingsTable from "./components/HoldingsTable";
import TransactionsTable from "./components/TransactionsTable";
import Holdings from "./pages/Holdings"; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes Wrapper */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* New Navigation Routes */}
        <Route path="/holdings" element={
            <ProtectedRoute>
              <Holdings /> {/* Use the full page component now */}
            </ProtectedRoute>
        } />
        
        {/* <Route path="/transactions" element={
          <ProtectedRoute>
            <div className="p-6"><TransactionsTable /></div>
          </ProtectedRoute>
        } /> */}
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />

        <Route path="/watchlist" element={
          <ProtectedRoute>
            <div className="p-6 text-white text-2xl">Watchlist Page (Coming Soon)</div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;