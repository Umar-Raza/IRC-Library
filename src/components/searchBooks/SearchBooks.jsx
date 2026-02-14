import React, { useEffect, useRef } from 'react';

export const SearchBooks = ({ onSearch }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. اگر صارف پہلے سے کسی ان پٹ یا ٹیکسٹ ایریا میں ٹائپ کر رہا ہو، تو شارٹ کٹ نہ چلے
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // اگر صارف ان پٹ کے اندر ہے اور 'Escape' دبائے تو فوکس ختم کر دے
        if (e.key === 'Escape') {
          inputRef.current?.blur();
        }
        return;
      }

      // 2. Ctrl + K یا Command + K (فوکس کرنے کے لیے)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // براؤزر کے ڈیفالٹ سرچ بار کو روکنے کے لیے
        inputRef.current?.focus();
      }

      // 3. Forward Slash (/) (صرف سلیش دبانے سے سرچ بار فوکس ہو جائے گا)
      if (e.key === '/') {
        e.preventDefault(); // سلیش کو ان پٹ کے اندر ٹائپ ہونے سے روکنے کے لیے
        inputRef.current?.focus();
      }
    };

    // 'keydown' ایونٹ براؤزر کے ڈیفالٹ ایکشن کو روکنے کے لیے بہترین ہے
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
        onFocus={(e) => (e.target.placeholder = "اردو کی بورڈ منتخب کریں۔۔۔")}
        onBlur={(e) => (e.target.placeholder = "کتاب یا مصنف سرچ کریں۔۔۔")}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <kbd className="kbd kbd-sm p-3">Ctrl + K</kbd>
    </label>
  );
};
