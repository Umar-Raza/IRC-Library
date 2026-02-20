import { useBooks } from '@/context/BooksContext';
import React, { useState, useRef, useEffect } from 'react';

export const SearchBooks = () => {

  const context = useBooks();
  const inputRef = useRef(null); 
  const [inputValue, setInputValue] = useState(context?.searchTerm || "");

  useEffect(() => {
    const handleSlash = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault(); 
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleSlash);
    return () => document.removeEventListener('keydown', handleSlash);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() === "") {
      if (context?.setSearchTerm) context.setSearchTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && context?.setSearchTerm) {
      context.setSearchTerm(inputValue.trim());
    }
    if (e.key === 'Escape') {
      setInputValue("");
      if (context?.setSearchTerm) {
        context.setSearchTerm("");
      }
      inputRef.current?.blur(); 
    }
  };

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
        onFocus={(e) => (e.target.placeholder = "اردو کی بورڈ منتخب کریں۔۔۔")}
        onBlur={(e) => (e.target.placeholder = "کتاب یا مصنف سرچ کریں۔۔۔")}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      <kbd className="kbd kbd-sm p-3">/</kbd>
    </label>
  );
};