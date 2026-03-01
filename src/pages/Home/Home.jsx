import React from 'react'

import { Contact } from '../contact/Contact'

import { About } from '../about/About'
import Header from '@/components/heroSection/HeroSection'
import HeroSection from '@/components/heroSection/HeroSection'

export const Home = () => {

    return (
        <>  
            <HeroSection />
            <About/>
            <Contact />
        </>
    )
}