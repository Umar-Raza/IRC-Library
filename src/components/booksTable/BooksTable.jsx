import React from 'react'
import { Book, BookDown, Download, EllipsisVertical, Loader, SquareMousePointer, SquarePen } from 'lucide-react'
import { DeleteBook } from '@/pages/dashboard/librarianDasboard/DeleteBook';
import { toast } from 'react-hot-toast';
import { useBooks } from '@/context/BooksContext';
import { useAuth } from '@/context/AuthContext';

export const BooksTable = ({ books, handleEditBook, updateStatus, loading, isAdmin = false }) => {

  const { readerName, isLibrarian } = useAuth();
  const { updatingBookId } = useBooks();

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td><div className="h-4 w-4 bg-base-300 rounded"></div></td>
      <td><div className="h-14 w-14 bg-base-300 rounded-xl"></div></td>
      <td>
        <div className="h-4 w-32 bg-base-300 rounded mb-2"></div>
        <div className="h-3 w-24 bg-base-300 rounded"></div>
      </td>
      <td>
        <div className="h-3 w-24 bg-base-300 rounded"></div>
        <div className="h-4 w-20 bg-base-300 rounded mb-2 mt-2"></div>
        <div className="h-4 w-16 bg-base-300 rounded"></div>
      </td>
      <td><div className="h-8 w-27 bg-base-300 rounded"></div></td>
      <td><div className="h-8 w-36 bg-base-300 rounded mx-auto"></div></td>
      {isAdmin && <td><div className="h-8 w-8 bg-base-300 rounded mx-auto"></div></td>}
    </tr>
  );


  return (
    <>
      <div className="relative overflow-x-auto max-h-[70vh]" dir="rtl">
        <table className="table w-full min-w-200 zain-light">
          <thead className="bg-neutral sticky top-0 text-neutral-content z-20">
            <tr>
              <th className="w-10">#</th>
              <th className="w-20">تصویر</th>
              <th className="w-60">کتاب</th>
              <th className="w-40">کتاب کی تفصیل</th>
              <th className="w-30 " >کتاب ڈاؤن لوڈ</th>
              <th className="w-40 text-center">اسٹیٹس</th>
              {isAdmin && <th className="w-24 text-center">ایکشن</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
            ) : (
              books.map((book, index) => (
                <tr key={book.id} className="border-b border-base-300 align-top">
                  <td className="py-4 font-bold">{index + 1}</td>
                  <td className="py-4">
                    <div className={`dropdown dropdown-hover relative ${index < 2 ? 'dropdown-bottom' :
                      index > books.length - 3 ? 'dropdown-top' : 'dropdown-right'}`}>

                      {book.createdAt && (new Date() - book.createdAt.toDate()) / (1000 * 60 * 60 * 24) <= 15 && (
                        <span className="badge badge-accent badge-sm font-sans animate-pulse absolute bottom-17 -right-7 z-[10]">NEW</span>
                      )}

                      {book.titlePage ? (
                        <img
                          src={book.titlePage}
                          className="w-18 h-21 rounded-sm object-cover shadow cursor-pointer"
                          alt={book.bookName}
                        />
                      ) : (
                        <div className="w-18 h-21 bg-base-200 rounded-sm flex items-center justify-center text-[10px] text-center p-1">
                          {book.bookName}
                        </div>
                      )}
                      <div className={`dropdown-content z-11 card card-compact w-48 p-1 shadow-2xl bg-base-100 border border-base-300 ${index < 2 ? 'mt-2' : index > books.length - 3 ? 'mb-2' : 'ml-2'}`}>
                        {book.titlePage ? (
                          <img src={book.titlePage} className="w-48 h-64 rounded-lg object-cover" alt={book.bookName} />
                        ) : (
                          <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center">
                            <Book size={32} className="text-base-400" />
                          </div>
                        )}

                        <div className="card-body p-2 flex items-center justify-center">
                          <h3 className="card-title mx-auto text-sm text-center leading-tight">{book.bookName}</h3>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1">
                      <p className="text-[19px] bookName font-bold">{book.bookName}</p>
                      <p className="text-sm">
                        <span className="font-semibold text-[16px]">مصنف:</span>
                        <span className="text-[15px] mr-1">{book.author}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold text-[16px]">مضمون:</span> <span className="text-[15px] mr-1">{book.subject}</span></p>
                      <p><span className="font-semibold text-[16px]">لائبریری کوڈ:</span> <span className="text-[15px] mr-1">{book.libraryCode}</span></p>
                      <p><span className="font-semibold text-[16px]">مکتبہ:</span> <span className="text-[15px] mr-1">{book.publisher}</span></p>
                    </div>
                  </td>
                  <td className="py-4 text-center whitespace-nowrap">
                    <button
                      className="btn btn-outline btn-accent btn-sm sm:btn-md font-sans"
                      onClick={() => {
                        if (book.bookLink) {
                          window.open(book.bookLink, '_blank');
                        } else {
                          toast.error("!کتاب موجود نہیں ہے");
                        }
                      }}
                    >
                      Download <Download size={20} />
                    </button>
                  </td>
                  <td className="py-4 text-center whitespace-nowrap">
                    <div className="relative flex items-center justify-center w-full min-w-32 h-10">

                      {/* Reader */}
                      {!isLibrarian && readerName && (() => {
                        const isIssuedToMe = book.status === readerName;
                        const isAvailable = book.status === 'library';
                        const issuedToOther = !isAvailable && !isIssuedToMe;

                        // Display current holder if issued user
                        if (isIssuedToMe) {
                          return (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm select-none">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                              {readerName}
                            </span>
                          );
                        }

                        // Borrow available book — active button
                        if (isAvailable) {
                          const isUpdating = updatingBookId === book.id;
                          return (
                            <button
                              onClick={() => !isUpdating && updateStatus(book.id, readerName)}
                              disabled={isUpdating}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-neutral text-white border border-neutral font-sens-semibold shadow-sm hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-60"
                            >
                              {isUpdating ? <Loader className="w-5 h-4 animate-spin" /> : 'Borrow'}
                            </button>
                          );
                        }

                        // Book transfer to another reader — Show current holder and allow transfer
                        if (issuedToOther) {
                          const isUpdating = updatingBookId === book.id;
                          return (
                            <button
                              onClick={() => !isUpdating && updateStatus(book.id, readerName)}
                              disabled={isUpdating}
                              title={`Click to borrow from ${book.status} to you`}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-700 border border-amber-300 shadow-sm hover:bg-amber-100 hover:border-amber-400 transition-all cursor-pointer disabled:opacity-60"
                            >
                              {isUpdating ? <Loader className="w-5 h-4 animate-spin text-amber-700" /> : book.status}
                            </button>
                          );
                        }
                      })()}

                      {/* For Librarian  */}
                      {isLibrarian && (() => {
                        const isAvailable = book.status === 'library';
                        const isUpdating = updatingBookId === book.id;

                        if (isAvailable) {
                          return (
                            <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm select-none">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                              Available
                            </span>
                          );
                        }
                        return (
                          <button
                            onClick={() => !isUpdating && updateStatus(book.id, 'library')}
                            disabled={isUpdating}
                            title="Return to library"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-700 border border-amber-300 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all cursor-pointer disabled:opacity-60"
                          >
                            {isUpdating ? <Loader className="w-5 h-4 animate-spin" /> : book.status}
                          </button>
                        );
                      })()}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="pt-6 text-center">
                      <div className="dropdown dropdown-left">
                        <button tabIndex={0} className="btn btn-ghost btn-sm"><EllipsisVertical /></button>
                        <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-box w-20 z-50">
                          <li>
                            <button className='btn btn-neutral btn-sm' onClick={() => handleEditBook(book)}>
                              <SquarePen size={14} />
                            </button>
                          </li>
                          <li><DeleteBook bookId={book.id} /></li>
                        </ul>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}