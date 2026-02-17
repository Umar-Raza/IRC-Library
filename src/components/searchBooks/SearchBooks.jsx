import { useBooks } from '@/context/BooksContext';
import React, { useRef, useState } from 'react';

export const SearchBooks = () => {

  const { searchBooksInFirestore } = useBooks();

  // یہ لائن شامل کریں تاکہ ایرر ختم ہو جائے
  const [searchTerm, setSearchTerm] = useState('');

  const timeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // اب یہ لائن ایرر نہیں دے گی
    setSearchTerm(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      searchBooksInFirestore(value);
    }, 500);
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
        // ref={inputRef}
        type="search"
        className="grow"
        placeholder="کتاب یا مصنف سرچ کریں۔۔۔"
        onFocus={(e) => (e.target.placeholder = "اردو کی بورڈ منتخب کریں۔۔۔")}
        onBlur={(e) => (e.target.placeholder = "کتاب یا مصنف سرچ کریں۔۔۔")}
        onChange={handleInputChange}
        value={searchTerm} // ان پٹ کو اسٹیٹ کے ساتھ جوڑیں
      />
      <kbd className="kbd kbd-sm p-3">/</kbd>
    </label>
  );
};
