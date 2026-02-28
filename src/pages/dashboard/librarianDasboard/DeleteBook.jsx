import { firestore } from '@/config/Firebase'
import { deleteDoc, doc, getDocs, collection, setDoc } from 'firebase/firestore'
import React from 'react'
import toast from 'react-hot-toast'
import { Trash } from 'lucide-react'
import { useBooks } from '@/context/BooksContext'

// metadata update helper
const updateMetadata = async () => {
    try {
        const snap = await getDocs(collection(firestore, 'books'));
        const subjects = new Set();
        const authors = new Set();
        snap.docs.forEach(d => {
            const data = d.data();
            if (data.subject) subjects.add(data.subject.trim());
            if (data.author) authors.add(data.author.trim());
        });
        await setDoc(doc(firestore, 'metadata', 'library'), {
            totalBooks: snap.size,
            totalSubjects: subjects.size,
            totalAuthors: authors.size,
            subjects: [...subjects].sort(),
            updatedAt: new Date()
        });
    } catch (err) {
        console.error('Metadata update error:', err);
    }
};

export const DeleteBook = ({ bookId }) => {
    const { setBooks } = useBooks();

    const handleDelete = async () => {
        if (window.confirm("کیا آپ واقعی یہ کتاب ڈیلیٹ کرنا چاہتے ہیں؟")) {
            try {
                await deleteDoc(doc(firestore, 'books', bookId));
                setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
                await updateMetadata(); // metadata update
                toast.success("Book deleted successfully!");
            } catch (err) {
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