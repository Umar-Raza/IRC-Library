import { firestore } from '@/config/Firebase'
import imageCompression from 'browser-image-compression'
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { EllipsisVertical } from 'lucide-react'
import { SquarePen } from 'lucide-react'
import { SquarePlus } from 'lucide-react'
import { Download } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteBook } from './DeleteBook'
import { DeleteReader } from './DeleteReader'
import { SearchBooks } from '@/components/searchBooks/SearchBooks'
const initialState = {
  bookName: '',
  author: '',
  bookLink: '',
  subject: '',
  bookNumber: '',
  titlePage: null, status: '',
  publisher: '',
}

export const LibrarianDashboard = () => {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [readers, setReaders] = useState([])
  const [books, setBooks] = useState([])
  const [newReaderName, setNewReaderName] = useState('')
  const [editingBookId, setEditingBookId] = useState(null)
  const [activeBookId, setActiveBookId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')



  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setState({ ...state, [e.target.name]: e.target.files[0] });
      return;
    }
    setState({ ...state, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { titlePage, createdAt, ...restOfData } = state;
    // 1. If title page is a file, compress and upload to Cloudinary, then get the URL
    let imageUrl = state.titlePage;

    if (titlePage && titlePage instanceof File) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }

      let compressedTitlePage = titlePage;
      try {
        compressedTitlePage = await imageCompression(titlePage, options);
      } catch (error) {
        console.log("Compression error:", error);
      }

      const data = new FormData();
      data.append("file", compressedTitlePage, state.bookName || "book_image");
      data.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_uploadPreset); // Replace with your Cloudinary preset
      data.append("cloud_name", import.meta.env.VITE_APP_CLOUDINARY_cloudName);    // Replace with your Cloudinary cloud name

      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      imageUrl = file.secure_url;
    }

    try {
      if (editingBookId) {
        // Update existing book
        const bookRef = doc(firestore, 'books', editingBookId);
        await updateDoc(bookRef, {
          ...restOfData,
          titlePage: imageUrl,
        });
        toast.success('Book updated successfully');
      } else {
        // Add new book
        await addDoc(collection(firestore, 'books'), {
          ...restOfData,
          titlePage: imageUrl,
          createdAt: new Date(),
        });
        toast.success('Book added successfully');
      }

      document.getElementById('my_modal_4').close()
      setState(initialState)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log(err)
      toast.error('Failed to add book')
    } finally {
      setLoading(false)
      setEditingBookId(null)
    }
  }

  // 1. Loading readers from database with real-time updates
  useEffect(() => {
    const q = query(collection(firestore, 'readers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReaders(list);
    });
    return () => unsubscribe();
  }, []);

  // 1. Loading books from database with real-time updates
  useEffect(() => {
    const q = query(collection(firestore, 'books'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(list);
    });
    return () => unsubscribe();
  }, []);

  // 2. Add new reader and update book status
  const handleAddNewReaderSubmit = async () => {
    const trimmedName = newReaderName.trim();
    if (!trimmedName) return;

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'readers'), {
        name: trimmedName,
        createdAt: new Date()
      });
      if (activeBookId) {
        await updateStatus(activeBookId, trimmedName);
      }
      setNewReaderName('');
      document.getElementById('reader_modal').close();
      toast.success('New reader added successfully!');
    } catch (err) {
      toast.error("Something went wrong while adding new reader!");
    } finally {
      setLoading(false);
    }
  };

  // 3. Status update Function
  const updateStatus = async (bookId, newStatus) => {
    try {
      const bookRef = doc(firestore, 'books', bookId);
      await updateDoc(bookRef, { status: newStatus });
      toast.success(`Status Updated!: ${newStatus}`);
    } catch (err) {
      toast.error("Status update failed!");
    }
  };

  // Edit book function - populate the form with existing data and open modal
  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setState({
      bookName: book.bookName || '',
      author: book.author || '',
      bookLink: book.bookLink || '',
      subject: book.subject || '',
      bookNumber: book.bookNumber || '',
      titlePage: book.titlePage || null,
      status: book.status || '',
      publisher: book.publisher || '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    document.getElementById('my_modal_4').showModal();
  };

  // Filter books based on search term
  const filteredBooks = books
    .filter((book) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        book.bookName?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower);
      const matchesSubject = subjectFilter === "" || subjectFilter === "کتابوں کی قسمیں" || book.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);

      if (sortOrder === 'نئی کتابیں') return dateB.getTime() - dateA.getTime();
      if (sortOrder === 'پرانی کتابیں') return dateA.getTime() - dateB.getTime();
      if (sortOrder === 'ا → ے') return (a.bookName || "").localeCompare((b.bookName || ""), 'ur');
      if (sortOrder === 'ے → ا') return (b.bookName || "").localeCompare((a.bookName || ""), 'ur');
      return 0;
    });

  return (
    <div className="card card-side bg-base-100 shadow-xl m-4 w-[80%] mx-auto min-h-100vh">
      <div className="card-body">
        <div className="btn-and-heading flex justify-between items-center">
          <h2 className="card-title text-2xl font-bold mt-3 mb-5">Librarian Dashboard</h2>
          <div className="flex gap-2 mb-5">
            <button className="btn btn-neutral" onClick={() => document.getElementById('reader_modal').showModal()}>Manage Readers</button>
            <button className="btn btn-neutral " onClick={() => { setEditingBookId(null); setState(initialState); document.getElementById('my_modal_4').showModal() }}>Add New Book<SquarePlus /></button>
          </div>
          <dialog id="my_modal_4" className="modal" dir='rtl'>
            <div className="modal-box w-11/12 max-w-5xl">
              <button className="btn btn-error btn-soft btn-circle text-lg absolute right-2 top-4" onClick={() => { document.getElementById('my_modal_4').close(); setEditingBookId(null); setState(initialState); }}>✕</button>
              <h1 className="font-bold text-end text-2xl text-neutral">{editingBookId ? 'Edit Book' : 'Add Books'}</h1>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
                <input type="text" required placeholder="نام کتاب" value={state.bookName} onChange={handleChange} name='bookName' id='bookName' className="input file-input-lg input-bordered w-full" />
                <input type="text" required placeholder="مصنف" value={state.author} name='author' onChange={handleChange} id='author' className="input file-input-lg input-bordered w-full" />
                <input type="text" placeholder="کتاب لنک" value={state.bookLink} name='bookLink' onChange={handleChange} id='bookLink' className="input file-input-lg input-bordered w-full" />
                <input type="text" required placeholder="قسم" value={state.subject} name='subject' onChange={handleChange} id='subject' className="input file-input-lg input-bordered w-full" />
                <input type="text" required placeholder="کتاب نمبر" value={state.bookNumber} name='bookNumber' onChange={handleChange} id='bookNumber' className="input file-input-lg input-bordered w-full" />
                <input type="file" ref={fileInputRef} placeholder="ٹائٹل پیج" name='titlePage' onChange={handleChange} id='titlePage' className="file-input file-input-lg file-input-bordered w-full " />
                <select name='status' required id='status' value={state.status || ""} onChange={handleChange} className="select select-lg select-bordered w-full">
                  <option value="" required disabled={true}>اسٹیٹس</option>
                  <option value="library" defaultValue={true}>لائبریری</option>
                </select>
                <input type="text" placeholder="مکبتہ" value={state.publisher} name='publisher' onChange={handleChange} id='publisher' className="input file-input-lg input-bordered w-full " />
                <div className='mt-3 w-full flex justify-center md:col-span-2'>
                  <button dir='ltr' className="btn btn-neutral btn-wide" type='submit' disabled={loading}>
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span>
                        <span>Processing...</span>
                      </>
                    ) : (
                      editingBookId ? 'Update Book' : 'Add Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
        <div className="bg-base-100 rounded-xl shadow p-4 mb-4" dir="rtl">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBooks onSearch={(value) => setSearchTerm(value)} />
            <select
              className="select select-bordered w-full md:w-1/5"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">تمام مضامین</option>
              {[...new Set(books.map(book => book.subject))].filter(Boolean).map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              className="select select-bordered w-full md:w-1/5"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option>نئی کتابیں</option>
              <option>پرانی کتابیں</option>
              <option>ا → ے</option>
              <option>ے → ا</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[60vh]" dir="rtl">
          <table className="table w-full noto-naskh-arabic-font">
            <thead className="bg-neutral sticky top-0 z-10 text-neutral-content">
              <tr>
                <th className="w-10">#</th>
                <th className="w-20">تصویر</th>
                <th className="w-60">کتاب</th>
                <th className="w-40">کتاب کی تفصیل</th>
                <th className="w-30">کتاب ڈاؤن لوڈ</th>
                <th className="w-40 text-center">اسٹیٹس</th>
                <th className="w-24 text-center">ایکشن</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 && !searchTerm ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td><div className="h-4 w-4 bg-base-300 rounded"></div></td>
                    <td><div className="h-14 w-14 bg-base-300 rounded-xl"></div></td>
                    <td>
                      <div className="h-4 w-32 bg-base-300 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-base-300 rounded"></div>
                    </td>
                    <td><div className="h-4 w-20 bg-base-300 rounded mb-2">
                    </div><div className="h-4 w-16 bg-base-300 rounded"></div></td>
                    <td><div className="h-4 w-12 bg-base-300 rounded"></div></td>
                    <td><div className="h-8 w-36 bg-base-300 rounded mx-auto"></div></td>
                    <td><div className="h-8 w-8 bg-base-300 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredBooks.map((book, index) => (
                <tr
                  key={book.id}
                  className="border-b border-base-300 align-top hover:bg-base-200/40"
                >
                  <td className="py-4 font-bold">{index + 1}</td>
                  <td className="py-4">
                    <div className="dropdown dropdown-right dropdown-hover relative">
                      {book.createdAt && (new Date() - book.createdAt.toDate()) / (1000 * 60 * 60 * 24) <= 15 && (
                        <span className="badge badge-accent badge-sm font-sans animate-pulse absolute bottom-17 -right-7 z-8">
                          NEW
                        </span>
                      )}
                      <img
                        tabIndex={0}
                        src={book.titlePage}
                        className="w-18 h-20 rounded-sm object-cover shadow cursor-pointer"
                        alt={book.bookName}
                      />
                      <div tabIndex={0} className="dropdown-content z-100 card card-compact w-64 p-2 shadow bg-base-100 border border-base-300 ml-2">
                        <img src={book.titlePage} className="w-full h-auto rounded-lg" alt={book.bookName} />
                        <div className="card-body p-2">
                          <h3 className="card-title mx-auto text-sm">{book.bookName}</h3>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[21px] bookName">{book.bookName}</p>
                      </div>

                      <p className="text-sm">
                        <span className="font-semibold text-[18px]">مصنف:</span>
                        <span className="text-[16px] mr-1">
                          {book.author}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-semibold text-[18px]">قسم:</span>
                        <span className="text-[16px] mr-1">
                          {book.subject}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[18px]">کتاب نمبر:</span>
                        <span className="text-[16px] mr-1">
                          {book.bookNumber}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[18px]">مکتبہ:</span>
                        <span className="text-[16px] mr-1">
                          {book.publisher}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <button
                      className="btn btn-outline btn-accent flex items-center justify-center gap-2 font-sans"
                      onClick={() => {
                        if (book.bookLink) {
                          window.open(book.bookLink, '_blank', 'noopener,noreferrer');
                        } else {
                          toast.error("!کتاب کا لنک موجود نہیں ہے");
                        }
                      }}
                    >
                      Download <Download size={20} />
                    </button>
                  </td>

                  <td className="py-4 text-center">
                    <select
                      className={`select select-sm w-36 ${book.status === 'library'
                        ? 'select-success'
                        : 'select-error'
                        }`}
                      value={book.status}
                      onChange={(e) => updateStatus(book.id, e.target.value)}
                    >
                      <option value="library">لائبریری</option>
                      {readers.map((reader) => (
                        <option key={reader.id} value={reader.name}>
                          {reader.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="pt-6 text-center">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-ghost btn-sm">
                        <EllipsisVertical />
                      </button>
                      <ul className="dropdown-content menu shadow bg-base-100 rounded-box w-20">
                        <li>
                          <button className='btn btn-neutral' onClick={() => handleEditBook(book)}>
                            <SquarePen size={14} />
                          </button>
                        </li>
                        <li>
                          <DeleteBook bookId={book.id} />
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div >

      {/* Add new reader modal */}
      <dialog id="reader_modal" className="modal">
        <div className="modal-box max-w-sm " >
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute btn-error right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Add New Reader</h3>
          <div className="form-control">
            <input
              type="text"
              required
              placeholder="New Reader Name"
              className="input input-bordered input-lg w-full"
              value={newReaderName}
              onChange={(e) => setNewReaderName(e.target.value)}
            />
          </div>
          <div className="mt-4 max-h-40 overflow-y-auto border rounded-lg p-2">
            <p className="text-xs font-bold mb-2 text-gray-500">Existing Readers (Click trash to delete):</p>
            {readers.map((reader) => (
              <div key={reader.id} className="flex justify-between items-center p-1 hover:bg-base-200 rounded" dir="rtl">
                <span className="text-sm">{reader.name}</span>
                <DeleteReader readerId={reader.id} />
              </div>
            ))}
          </div>
          <div className="modal-action flex justify-center gap-2">
            <button className="btn btn-neutral btn-wide" onClick={handleAddNewReaderSubmit} disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  <span>loading...</span>
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div >
  )
};
