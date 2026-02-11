import React from 'react';

export const SearchBooks = ({ onSearch }) => {
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
        type="search"
        className="grow"
        placeholder="کتاب یا مصنف سرچ کریں۔۔۔"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <kbd className="kbd kbd-sm">K</kbd>
    </label>
  );
};
