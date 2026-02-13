import React, { useEffect, useRef } from 'react';

export const SearchBooks = ({ onSearch }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (

    <label className="input flex items-center w-full md:w-2/4">
      <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        ref={inputRef}
        type="search"
        className="grow"
        placeholder="کتاب یا مصنف سرچ کریں۔۔۔"
        onFocus={(e) => (e.target.placeholder = "اردو کی بورڈ منتخب کریں")}
        onBlur={(e) => (e.target.placeholder = "کتاب یا مصنف سرچ کریں۔۔۔")}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <kbd className="kbd kbd-sm p-3">Ctrl + K</kbd>
    </label>
  );
};
