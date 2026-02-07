import { firestore } from '@/config/Firebase'
import { addDoc, collection } from 'firebase/firestore'
import { EllipsisVertical } from 'lucide-react'
import { SquarePen } from 'lucide-react'
import { Trash } from 'lucide-react'
import { SquarePlus } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'

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

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setState({ ...state, [e.target.name]: e.target.files[0] });
      return;
    }
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleAddBooks = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { titlePage, ...restOfData } = state;

    const formData = {
      ...restOfData,
      createdAt: new Date(),
    }
    try {
      await addDoc(collection(firestore, 'books'), formData)

      toast.success('Book added successfully')
      console.log('Book added successfully')
      document.getElementById('my_modal_4').close()
      setState(initialState)
    } catch (err) {
      console.log(err)
      toast.error('Failed to add book')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="card card-side bg-base-100 shadow-xl m-4 min-h-100vh">
        <div className="card-body">
          <div className="btn-and-heading flex justify-between items-center">
            <h2 className="card-title text-2xl font-bold mt-3">Librarian Dashboard</h2>
            <button className="btn btn-neutral btn-square " onClick={() => document.getElementById('my_modal_4').showModal()}><SquarePlus /></button>
            <dialog id="my_modal_4" className="modal" dir='rtl'>
              <div className="modal-box w-11/12 max-w-5xl">
                <button className="btn btn-error btn-soft btn-circle text-lg absolute right-2 top-4" onClick={() => document.getElementById('my_modal_4').close()}>✕</button>
                <h1 className="font-bold text-end text-2xl text-neutral">Add Books</h1>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" onSubmit={handleAddBooks}>
                  <input type="text" placeholder="نام کتاب" value={state.bookName} onChange={handleChange} name='bookName' id='bookName' className="input file-input-lg input-bordered w-full" />
                  <input type="text" placeholder="مصنف" value={state.author} name='author' onChange={handleChange} id='author' className="input file-input-lg input-bordered w-full" />
                  <input type="number" placeholder="جلدیں" value={state.volumes} name='volumes' onChange={handleChange} id='volumes' className="input file-input-lg input-bordered w-full" />
                  <input type="text" placeholder="قسم" value={state.subject} name='subject' onChange={handleChange} id='subject' className="input file-input-lg input-bordered w-full" />
                  <input type="text" placeholder="کتاب نمبر" value={state.bookNumber} name='bookNumber' onChange={handleChange} id='bookNumber' className="input file-input-lg input-bordered w-full" />
                  <input type="file" placeholder="ٹائٹل پیج" name='titlePage' onChange={handleChange} id='titlePage' className="file-input file-input-lg file-input-bordered w-full " />
                  <select name='status' id='status' value={state.status} onChange={handleChange} className="select select-lg select-bordered w-full">
                    <option value="" disabled={true}>اسٹیٹس</option>
                    <option>لائبریری</option>
                    <option>عرفان</option>
                    <option>عباس</option>
                  </select>
                  <input type="text" placeholder="مکبتہ" value={state.publisher} name='publisher' onChange={handleChange} id='publisher' className="input file-input-lg input-bordered w-full " />
                  <div className='mt-3 w-full flex justify-center md:col-span-2'>
                    <button dir='ltr' className="btn btn-neutral btn-wide" type='submit' disabled={loading}>
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-md"></span>
                          <span>Adding...</span>
                        </>
                      ) : (
                        'Add Book'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
          <div className="overflow-x-auto " dir="rtl">
            <table className="table w-full text-right noto-naskh-arabic-font min-h-100vh">
              <thead>
                <tr className="text-lg ">
                  <th>#</th>
                  <th>ٹائٹل پیج</th>
                  <th>نام کتاب</th>
                  <th>مصنف</th>
                  <th>جلدیں</th>
                  <th>قسم</th>
                  <th>کتاب نمبر</th>
                  <th>ایکشن</th>
                  <th><legend className="fieldset-legend">اسٹیٹس</legend></th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover">
                  <td className="font-bold">1</td>
                  <td><img
                    className="mask mask-squircle w-12 h-12 m-0 p-0"
                    src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp" /></td>
                  <td className="font-bold">صحیح بخاری</td>
                  <td>امام بخاری</td>
                  <td>8</td>
                  <td>8</td>
                  <td>A-12</td>
                  <td>
                    <div className="dropdown dropdown-bottom dropdown-end">
                      <div tabIndex={0} role="button" className="text-3xl text-neutral cursor-pointer"><EllipsisVertical /></div>
                      <ul tabIndex="-1" className="dropdown-content menu rounded-box z-1 p-2  shadow-sm">
                        <button className="btn btn-error btn-sm m-1"><Trash /></button>
                        <button className="btn btn-secondary btn-sm m-1"><SquarePen /></button>
                      </ul>
                    </div>
                  </td>
                  <td>
                    <fieldset className="fieldset">
                      <select defaultValue="نام منتخب کریں" className="select select-bordered w-30">
                        <option disabled={true}>نام منتخب کریں</option>
                        <option>عمر</option>
                        <option>عرفان</option>
                        <option>عباس</option>
                      </select>
                    </fieldset>
                  </td>
                </tr>
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
    </div >
  )
}
