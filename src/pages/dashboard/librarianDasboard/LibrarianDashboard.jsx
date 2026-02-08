import { firestore } from '@/config/Firebase'
import imageCompression from 'browser-image-compression'
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { EllipsisVertical } from 'lucide-react'
import { SquarePen } from 'lucide-react'
import { SquarePlus } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteBook } from './DeleteBook'
import { DeleteReader } from './DeleteReader'

const initialState = {
  bookName: '',
  author: '',
  volumes: '',
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
        maxSizeMB: 0.05,
        maxWidthOrHeight: 48,
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
    if (!trimmedName || !activeBookId) return;

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'readers'), { 
        name: trimmedName,
        createdAt: new Date() 
      }); 
      await updateStatus(activeBookId, trimmedName);
      setNewReaderName('');
      document.getElementById('reader_modal').close();
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
      volumes: book.volumes || '',
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

  return (
    <div>
      <div className="card card-side bg-base-100 shadow-xl m-4 min-h-100vh">
        <div className="card-body">
          <div className="btn-and-heading flex justify-between items-center">
            <h2 className="card-title text-2xl font-bold mt-3">Librarian Dashboard</h2>
            <button className="btn btn-neutral btn-square " onClick={() => { setEditingBookId(null); setState(initialState); document.getElementById('my_modal_4').showModal() }}><SquarePlus /></button>
            <dialog id="my_modal_4" className="modal" dir='rtl'>
              <div className="modal-box w-11/12 max-w-5xl">
                <button className="btn btn-error btn-soft btn-circle text-lg absolute right-2 top-4" onClick={() => { document.getElementById('my_modal_4').close(); setEditingBookId(null); setState(initialState); }}>✕</button>
                <h1 className="font-bold text-end text-2xl text-neutral">{editingBookId ? 'Edit Book' : 'Add Books'}</h1>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
                  <input type="text" required placeholder="نام کتاب" value={state.bookName} onChange={handleChange} name='bookName' id='bookName' className="input file-input-lg input-bordered w-full" />
                  <input type="text" required placeholder="مصنف" value={state.author} name='author' onChange={handleChange} id='author' className="input file-input-lg input-bordered w-full" />
                  <input type="number" required placeholder="جلدیں" value={state.volumes} name='volumes' onChange={handleChange} id='volumes' className="input file-input-lg input-bordered w-full" />
                  <input type="text" required placeholder="قسم" value={state.subject} name='subject' onChange={handleChange} id='subject' className="input file-input-lg input-bordered w-full" />
                  <input type="text" required placeholder="کتاب نمبر" value={state.bookNumber} name='bookNumber' onChange={handleChange} id='bookNumber' className="input file-input-lg input-bordered w-full" />
                  <input type="file" ref={fileInputRef} placeholder="ٹائٹل پیج" name='titlePage' onChange={handleChange} id='titlePage' className="file-input file-input-lg file-input-bordered w-full " />
                  <select name='status' required id='status' value={state.status || ""} onChange={handleChange} className="select select-lg select-bordered w-full">
                    <option value="" required disabled={true}>اسٹیٹس</option>
                    <option value="library">لائبریری</option>
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
          <div className="overflow-x-auto max-h-[80vh]" dir="rtl">
            <table className="table w-full text-right mt-5 noto-naskh-arabic-font min-h-100vh border-separate ">
              <thead className="bg-neutral text-neutral-content sticky top-0 z-10">
                <tr className="text-lg  text-bold">
                  <th className="rounded-tr-2xl">#</th>
                  <th>ٹائٹل پیج</th>
                  <th>نام کتاب</th>
                  <th>مصنف</th>
                  <th>جلدیں</th>
                  <th>قسم</th>
                  <th>کتاب نمبر</th>
                  <th>ایکشن</th>
                  <th className="rounded-tl-2xl"><legend className="fieldset-legend text-neutral-content">اسٹیٹس</legend></th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  // Skeleton loader for 5 rows
                  [...Array(10)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton bg-neutral/10 h-4 w-4"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-12 w-12 shrink-0 rounded-full"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-4 w-32"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-4 w-24"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-4 w-8"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-4 w-20"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-4 w-16"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-8 w-8"></div></td>
                      <td><div className="skeleton bg-neutral/10 h-8 w-40"></div></td>
                    </tr>
                  ))
                ) : books.map((book, index) => (
                  <tr key={book.id} className="hover">
                    <td className="font-bold">{index + 1}</td>
                    <td><img
                      className="mask mask-squircle w-12 h-12 m-0 p-0"
                      src={book.titlePage || "https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"} /></td>
                    <td className="font-bold">{book.bookName}</td>
                    <td>{book.author}</td>
                    <td>{book.volumes}</td>
                    <td>{book.subject}</td>
                    <td>{book.bookNumber}</td>
                    {/* Delete and Edit buttons*/}
                    <td>
                      <div className="dropdown dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="text-3xl text-neutral cursor-pointer"><EllipsisVertical /></div>
                        <ul tabIndex="-1" className="dropdown-content menu rounded-box z-1 p-2  shadow-sm">
                          <DeleteBook bookId={book.id} />
                          <button
                            onClick={() => handleEditBook(book)}
                            className="btn btn-secondary btn-sm m-1"
                          >
                            <SquarePen size={16} />
                          </button>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <select
                        className={`select select-bordered select-sm w-40 ${book.status === 'library' ? 'text-success border-success' : 'text-error border-error'}`}
                        value={book.status}
                        onChange={(e) => {
                          if (e.target.value === "ADD_NEW") {
                            setActiveBookId(book.id);
                            document.getElementById('reader_modal').showModal();
                          } else {
                            updateStatus(book.id, e.target.value);
                          }
                        }}
                      >
                        <option value="library">لائبریری</option>
                        {readers.map((reader) => (
                          <option key={reader.id} value={reader.name}>{reader.name}</option>
                        ))}
                        <option value="ADD_NEW" className="font-bold text-white text-center bg-neutral ">Manage Readers</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-lg">
                  <th>#</th>
                  <th>ٹائٹل</th>
                  <th>نام کتاب</th>
                  <th>مصنف</th>
                  <th>جلدیں</th>
                  <th>قسم</th>
                  <th>کتاب نمبر</th>
                  <th>ایکشن</th>
                  <th>اسٹیٹس</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div >

      {/* Add new reader modal */}
      <dialog id="reader_modal" className="modal">
        <div className="modal-box max-w-sm " dir="ltr">
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
              <div key={reader.id} className="flex justify-between items-center p-1 hover:bg-base-200 rounded">
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
