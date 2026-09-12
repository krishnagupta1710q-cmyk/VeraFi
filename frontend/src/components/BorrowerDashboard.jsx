import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  {
    label: 'Overview',
    path: '/borrower',
    icon: '⌂',
    end: true,
  },
  {
    label: 'Upload Ledger',
    path: '/borrower/upload',
    icon: '↑',
  },
  {
    label: 'AI Verification',
    path: '/borrower/verification',
    icon: '✦',
  },
  {
    label: 'Ledger',
    path: '/borrower/ledger',
    icon: '▤',
  },
  {
    label: 'Credit Score',
    path: '/borrower/credit-score',
    icon: '◔',
  },
];

export default function BorrowerDashboard({ user }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col">

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            V
          </div>

          <div className="ml-3">
            <p className="font-bold text-lg text-slate-900 dark:text-white">
              VeraFi
            </p>

            <p className="text-xs text-slate-400">
              Financial Trust
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">

          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Borrower
          </p>

          <div className="space-y-1">

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-sm
                  ${
                    isActive
                      ? `
                        bg-indigo-50
                        dark:bg-indigo-950/60
                        text-indigo-700
                        dark:text-indigo-300
                      `
                      : `
                        text-slate-600
                        dark:text-slate-300
                        hover:bg-slate-50
                        dark:hover:bg-slate-800
                      `
                  }
                  `
                }
              >
                <span className="w-6 text-center text-lg">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}

          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">

          <div className="flex items-center gap-3 px-2">

            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Borrower'}
              </p>

              <p className="text-xs text-slate-400">
                Borrower
              </p>
            </div>

          </div>

        </div>
      </aside>


      {/* ================= MAIN AREA ================= */}
      <div className="md:ml-64">

        {/* Mobile header */}
        <header className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4">

          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            V
          </div>

          <div className="ml-3">
            <p className="font-bold text-slate-900 dark:text-white">
              VeraFi
            </p>

            <p className="text-xs text-slate-400">
              Borrower Portal
            </p>
          </div>

        </header>


        {/* Desktop header */}
        <header className="hidden md:flex h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 items-center justify-between px-8">

          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Borrower Portal
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Financial trust assessment
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </p>

              <p className="text-xs text-slate-400">
                Borrower
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

          </div>

        </header>


        {/* Page content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}