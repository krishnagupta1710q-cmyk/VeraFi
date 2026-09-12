import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import LenderDashboard from './components/LenderDashboard';
import BorrowerDashboard from './components/BorrowerDashboard';

import BorrowerHome from './pages/BorrowerHome';
import UploadLedger from './pages/UploadLedger';
import Verification from './pages/Verification';
import LedgerPage from './pages/LedgerPage';
import CreditScorePage from './pages/CreditScorePage';

import { SAMPLE_DATASETS } from './mockData';
import { uploadLedgerImage } from './services/api';

export default function App() {

  const [user, setUser] = useState(null);

  const [ledgerData, setLedgerData] = useState(
    SAMPLE_DATASETS.kirana_store
  );

  const [isLoading, setIsLoading] = useState(false);


  /* ================= LOGIN ================= */

  const handleLogin = (userData) => {
    setUser(userData);
  };


  /* ================= LEDGER ================= */

  const handleLedgerExtracted = async (
    file,
    sampleKey = null
  ) => {

    setIsLoading(true);

    try {

      const data = await uploadLedgerImage(
        file,
        sampleKey
      );

      setLedgerData(data);

    } catch (error) {

      console.error(
        'Failed to extract ledger:',
        error
      );

    } finally {

      setIsLoading(false);

    }
  };


  /* ================= LOGIN SCREEN ================= */

  if (!user) {

    return (
      <>
        <ThemeToggle />

        <Login
          onLogin={handleLogin}
        />
      </>
    );
  }


  /* ================= LENDER ================= */

  if (user.role === 'lender') {

    return (
      <>
        <ThemeToggle />

        <LenderDashboard />
      </>
    );
  }


  /* ================= BORROWER ================= */

  return (
    <BrowserRouter>

      <ThemeToggle />

      <Routes>

        <Route
          path="/borrower"
          element={
            <BorrowerDashboard
              user={user}
            />
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={
              <BorrowerHome
                user={user}
                ledgerData={ledgerData}
              />
            }
          />


          {/* Upload */}
          <Route
            path="upload"
            element={
              <UploadLedger
                onLedgerExtracted={
                  handleLedgerExtracted
                }
                isLoading={isLoading}
              />
            }
          />


          {/* AI Verification */}
          <Route
            path="verification"
            element={
              <Verification />
            }
          />


          {/* Ledger */}
          <Route
            path="ledger"
            element={
              <LedgerPage
                ledgerData={ledgerData}
              />
            }
          />


          {/* Credit Score */}
          <Route
            path="credit-score"
            element={
              <CreditScorePage
                ledgerData={ledgerData}
              />
            }
          />

        </Route>


        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/borrower"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}