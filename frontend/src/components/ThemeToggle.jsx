import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('verafi-theme') || 'system';
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'dark') {
      root.classList.add('dark');
    }

    if (theme === 'light') {
      root.classList.add('light');
    }

    if (theme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      root.classList.add(prefersDark ? 'dark' : 'light');
    }

    localStorage.setItem('verafi-theme', theme);
  }, [theme]);

  const options = [
    {
      value: 'light',
      icon: '☀',
      label: 'Light',
    },
    {
      value: 'dark',
      icon: '☾',
      label: 'Dark',
    },
    {
      value: 'system',
      icon: '◐',
      label: 'System',
    },
  ];

  const currentOption =
    options.find((option) => option.value === theme) || options[2];

  return (
    <div className="fixed top-5 right-5 z-[100]">

      {/* Theme Button */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Change theme"
        className="
          w-11 h-11
          rounded-xl
          flex items-center justify-center

          bg-white/90
          dark:bg-slate-900/90

          border
          border-slate-200
          dark:border-slate-700

          text-slate-700
          dark:text-slate-200

          shadow-sm
          backdrop-blur-md

          transition-all
          duration-200

          hover:-translate-y-1
          hover:shadow-md

          active:translate-y-0
        "
      >
        <span className="text-lg">
          {currentOption.icon}
        </span>
      </button>


      {/* Theme Dialog */}
      {isOpen && (
        <div
          className="
            absolute
            right-0
            mt-2
            w-44

            rounded-2xl

            bg-white
            dark:bg-slate-900

            border
            border-slate-200
            dark:border-slate-700

            shadow-xl

            p-2

            animate-[fadeIn_0.15s_ease-out]
          "
        >

          <div className="px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Appearance
            </p>
          </div>


          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full
                flex
                items-center
                gap-3

                px-3
                py-2.5

                rounded-xl

                text-sm
                font-medium

                transition-all
                duration-200

                hover:-translate-y-0.5

                ${
                  theme === option.value
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
              `}
            >
              <span className="text-base w-5">
                {option.icon}
              </span>

              <span>
                {option.label}
              </span>

              {theme === option.value && (
                <span className="ml-auto text-indigo-600 dark:text-indigo-400">
                  ✓
                </span>
              )}
            </button>
          ))}

        </div>
      )}

    </div>
  );
}