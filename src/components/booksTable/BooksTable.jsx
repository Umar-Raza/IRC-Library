import React from 'react'
import { Book, BookAIcon, BookOpen, BookOpenText, Download, EllipsisVertical, SquarePen } from 'lucide-react'
import { DeleteBook } from '@/pages/dashboard/librarianDasboard/DeleteBook';
import { toast } from 'react-hot-toast';

export const BooksTable = ({ books, readers, updateStatus, handleEditBook, loading, isAdmin = false }) => {

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
          <thead className="bg-neutral sticky top-0 z-10 text-neutral-content">
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
                <tr key={book.id} className="border-b border-base-300 align-top hover:bg-base-200/40">
                  <td className="py-4 font-bold">{index + 1}</td>
                  <td className="py-4">
                    <div className="dropdown dropdown-right dropdown-hover relative">
                      {book.createdAt && (new Date() - book.createdAt.toDate()) / (1000 * 60 * 60 * 24) <= 15 && (
                        <span className="badge badge-accent badge-sm font-sans animate-pulse absolute bottom-17 -right-7 z-8">NEW</span>
                      )}
                      {book.titlePage ? (
                        <img
                          src={book.titlePage || null}
                          className="w-18 h-21 rounded-sm object-cover shadow cursor-pointer"
                          alt={book.bookName}
                        />
                      ) : (
                        <div className="w-18 h-21 bg-base-200 rounded-sm flex items-center justify-center text-[10px] text-center">{book.bookName}</div>
                      )}

                      <div className="dropdown-content z-999 card card-compact w-48 p-1 shadow bg-base-100 border border-base-300 ml-2">
                        {book.titlePage ? (
                          <img src={book.titlePage || null} className="w-48 h-64 rounded-lg" alt={book.bookName} />
                        ) : (
                          <div className="w-46 h-20 bg-base-200 rounded-lg flex items-center justify-center"><Book size={32} className="text-base-400 " /></div>
                        )}
                        <div className="card-body p-2">
                          <h3 className="card-title mx-auto text-sm text-center">{book.bookName}</h3>
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
                    <select
                      className={`select select-sm w-full min-w-30 ${book.status === 'library' ? 'select-success' : 'select-error'}`}
                      value={book.status}
                      onChange={(e) => updateStatus(book.id, e.target.value)}
                    >
                      {!isAdmin && <option value="library">اسٹیٹس</option>}
                      {isAdmin && <option value="library">لائبریری</option>}
                      {readers.filter(reader => isAdmin || reader.name !== "library").map((reader) => (
                        <option key={reader.id} value={reader.name}>{reader.name}</option>
                      ))}
                    </select>
                  </td>
                  
                  {isAdmin && (
                    <td className="pt-6 text-center">
                      <div className="dropdown dropdown-left">
                        <button className="btn btn-ghost btn-sm"><EllipsisVertical /></button>
                        <ul className="dropdown-content menu shadow bg-base-100 rounded-box w-20">
                          <li>
                            <button className='btn btn-neutral' onClick={() => handleEditBook(book)}>
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