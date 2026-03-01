import React, { useEffect, useState, useRef } from 'react'
import { Loader, SearchIcon, SearchX } from 'lucide-react'
import { BooksTable } from '@/components/booksTable/BooksTable';
import { SearchBooks } from '@/components/searchBooks/SearchBooks';
import { ChevronDown, } from 'lucide-react';
import { useBooks } from '@/context/BooksContext';
export const IRCLibrary = () => {

  const [sortOrder, setSortOrder] = useState('ترتیب منتخب کریں');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const dropdownRef = useRef(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);
  const sortOptions = ["ا → ے", "ے → ا"];
  const [visibleCount, setVisibleCount] = useState(10);
  const subjectListRef = useRef(null);

  //  Books Context
  const { books, loading, loadingMore, hasMore, fetchMore, updateStatus, availableSubjects, selectedSubject, setSelectedSubject, searchTerm, setSearchTerm, setSortBy } = useBooks();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setSubjectSearch("");
        setVisibleCount(10); // Reset dropdown After close  
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Subject list load with scroll 
  useEffect(() => {
    const el = subjectListRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        setVisibleCount(v => v + 10);
      }
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isDropdownOpen]);

  const filteredSubjects = availableSubjects.filter(s =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );
  const displayedSubjects = subjectSearch ? filteredSubjects : filteredSubjects.slice(0, visibleCount);
  const hasMore_subjects = !subjectSearch && filteredSubjects.length > visibleCount;
  return (
    <div className="card bg-base-100 shadow-xl my-4 w-[98%] zain-light lg:w-[94%] xl:w-[92%] mx-auto border border-base-200 ">
      <div className="card-body">
        <div className="bg-base-100 rounded-xl shadow  border border-base-300 p-4 mb-2" dir="rtl">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 lg:flex-2 min-w-0">
              <SearchBooks onSearch={(value) => {
                setSearchTerm(value);
              }} />
            </div>

            <div className="relative w-full md:w-1/4 text-[16px]" ref={dropdownRef} dir="rtl">
              <div
                className="input input-bordered flex items-center text-base-content/60 justify-between cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="truncate">{selectedSubject === "All" || !selectedSubject ? "تمام مضامین" : selectedSubject}</span>
                <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-base-200 bg-base-200/50">
                    <div className="relative">
                      <SearchIcon className="absolute right-2 top-2.5 text-base-content/50 z-10" size={16} />
                      <input
                        type="text"
                        className="input input-sm input-bordered w-full pr-8"
                        placeholder="مضمون تلاش کریں..."
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto p-1 z-999" ref={subjectListRef}>
                    <li
                      className={`p-2 hover:bg-neutral hover:text-white rounded cursor-pointer ${selectedSubject === "All" ? 'bg-neutral text-white' : ''}`}
                      onClick={() => {
                        setSelectedSubject("All");
                        setIsDropdownOpen(false);
                        setSubjectSearch("");
                        setVisibleCount(10);
                      }}
                    >
                      تمام مضامین
                    </li>
                    {filteredSubjects.length === 0 && subjectSearch !== "" ? (
                      <li className="p-3 text-center text-base-content/50 text-sm">
                        معذرت! <span className="font-bold text-neutral">"{subjectSearch}"</span> کا مضمون نہیں ملا۔
                      </li>
                    ) : (
                      <>
                        {displayedSubjects.map((subject) => (
                          <li
                            key={subject}
                            className={`p-2 hover:bg-neutral hover:text-white rounded cursor-pointer mt-1 ${selectedSubject === subject ? 'bg-neutral text-white' : ''}`}
                            onClick={() => {
                              setSelectedSubject(subject);
                              setIsDropdownOpen(false);
                              setSubjectSearch("");
                              setVisibleCount(10);
                            }}
                          >
                            {subject}
                          </li>
                        ))}
                        {hasMore_subjects && (
                          <li className="p-2 mt-1 text-center text-xs text-base-content/30 select-none">
                            ↓ مزید دیکھنے کے لیے نیچے scroll کریں
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="relative w-full md:w-1/4 text-[16px]" ref={sortRef} dir="rtl">
              <div
                className="input input-bordered flex items-center justify-between cursor-pointer bg-base-100 pr-4 pl-3"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="truncate text-base-content/60 ">
                  {sortOrder || "ترتیب منتخب کریں"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-base-content/50 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isSortOpen && (
                <div className="absolute z-100 w-full mt-1 bg-base-100  border border-base-300 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <ul className="p-1">
                    {sortOptions.map((option) => (
                      <li
                        key={option}
                        className={`p-2.5 hover:bg-neutral hover:text-white rounded-lg cursor-pointer transition-colors text-sm mt-1 ${sortOrder === option ? 'bg-neutral text-white' : 'hover:bg-base-200'}`}
                        onClick={() => {
                          setSortOrder(option);
                          if (option === "ا → ے") setSortBy('a-z');
                          else setSortBy('newest');
                          setIsSortOpen(false);
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          {!loading && books.length === 0 ? (
            <div className="py-20 text-center bg-base-200/20 rounded-xl border border-dashed border-base-300">
              <SearchX size={64} className="mx-auto mb-4 text-base-content/20" />
              <h3 className="text-3xl font-bold text-base-content/50 noto-naskh-arabic-font">
                معذرت! کوئی کتاب نہیں ملی۔
              </h3>
              <p className="text-xl mt-2 text-base-content/40">
                {searchTerm
                  ? (
                    <span>آپ کی تلاش <span className="font-bold text-neutral">"{searchTerm}"</span> کے مطابق کوئی نتیجہ نہیں ملا۔</span>
                  )
                  : "اس مضمون میں فی الحال کوئی کتاب دستیاب نہیں ہے۔"}
              </p>
            </div>
          ) : (
            <BooksTable
              books={books}
              loading={loading}
              isAdmin={false}
              updateStatus={updateStatus}
              searchTerm={searchTerm}
            />
          )}
        </div>
        <div className="flex justify-center my-3">
          {hasMore && books.length > 0 && (
            <button
              onClick={() => fetchMore(false)}
              className="btn btn-neutral px-10"
              disabled={loading || loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mx-2" />
                  <span>انتظار فرمائیں</span>
                </>
              ) : 'مزید کتابیں دیکھیں'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}