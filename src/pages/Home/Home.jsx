import { SearchBooks } from '@/components/searchBooks/SearchBooks'
import React from 'react'
import { AllBooks } from '@/pages/AllBooks/AllBooks'
// import { AllBooks } from '../AllBooks/AllBooks'

export const Home = () => {
    return (
        <div>
            <SearchBooks />
            <AllBooks />
        </div>
    )
}
