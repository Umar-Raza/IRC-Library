import { firestore } from '@/config/Firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import React from 'react'
import toast from 'react-hot-toast'
import { Trash } from 'lucide-react'
import { useBooks } from '@/context/BooksContext'

export const DeleteBook = ({ bookId }) => {
    const { setBooks } = useBooks(); 

    const handleDelete = async () => {
        if (window.confirm("کیا آپ واقعی یہ کتاب ڈیلیٹ کرنا چاہتے ہیں؟")) {
            try {
                await deleteDoc(doc(firestore, 'books', bookId));
                setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
                toast.success("Book deleted successfully!");
            } catch (err) {
                // console.error("Error deleting book:", err);
                toast.error("کتاب ڈیلیٹ کرنے میں ناکامی ہوئی");
            }
        }
    };
    return (
        <button
            onClick={handleDelete}
            className="btn btn-error btn-sm m-1"
        >
            <Trash size={16} />
        </button>
    )
}
