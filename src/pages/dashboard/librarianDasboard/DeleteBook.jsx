import { firestore } from '@/config/Firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import React from 'react'
import toast from 'react-hot-toast'
import { Trash } from 'lucide-react'

export const DeleteBook = ({ bookId }) => {
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await deleteDoc(doc(firestore, 'books', bookId));
                toast.success("Book deleted successfully");
            } catch (err) {
                console.error("Error deleting book:", err);
                toast.error("Failed to delete book");
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
