import React from 'react'
import { firestore } from '@/config/Firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { Trash } from 'lucide-react'

export const DeleteReader = ({ readerId }) => {
    // 4. Delete reader Function
    const handleDeleteReader = async (readerId) => {
        if (window.confirm("Are you sure you want to delete this reader?")) {
            try {
                await deleteDoc(doc(firestore, 'readers', readerId));
                toast.success("Reader deleted successfully");
            } catch (err) {
                toast.error("Failed to delete reader");
            }
        }
    };
    return (
        <button
            onClick={() => handleDeleteReader(readerId)}
            className="btn btn-sm btn-error"
        >
            <Trash size={14} />
        </button>
    )
}
