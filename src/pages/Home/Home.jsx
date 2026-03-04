import React from 'react'

import { Contact } from '../contact/Contact'

import { About } from '../about/About'
import HeroSection from '@/components/heroSection/HeroSection'
import { BSAStatistics } from '@/components/bsaStatistics/BSAStatistics'
import { ScrollToTop } from '@/components/scrollToTop/ScrollToTop'

export const Home = () => {

    return (
        <>
            <HeroSection />
            <BSAStatistics />
            <About />
            <Contact />
            <ScrollToTop/>
        </>
    )
}