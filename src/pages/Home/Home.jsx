import React from 'react'

import { Contact } from '../contact/Contact'
import { Header } from '@/components/header/Header'
import { About } from '../about/About'

export const Home = () => {

    return (
        <>  
            <Header />
            <About/>
            <Contact />
        </>
    )
}