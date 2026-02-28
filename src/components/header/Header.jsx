import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, ShieldCheck } from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
export const Header = () => {
    const { totalBooks, totalSubjects, totalAuthors } = useBooks()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    const stats = [
        { number: totalBooks > 0 ? `${totalBooks}` : "2700", label: "Volumes" },
        { number: totalSubjects > 0 ? `${totalSubjects}+` : "70", label: "Subjects" },
        { number: totalAuthors > 0 ? `${totalAuthors}+` : "150", label: "Authors" },
    ]

    return (
        <>
            {/* Google Fonts */}
            < link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

            <section className="relative overflow-hidden min-h-screen flex items-center">

                {/* Background */}
                <div className="absolute inset-0 bg-base-100">
                    <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="islamic" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                                <polygon points="40,0 80,20 80,60 40,80 0,60 0,20" fill="none" stroke="currentColor" strokeWidth="1" />
                                <polygon points="40,15 65,27 65,53 40,65 15,53 15,27" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#islamic)" className="text-neutral" />
                    </svg>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-base-200/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-neutral/5 blur-3xl" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 w-[98%] lg:w-[94%] xl:w-[92%] mx-auto px-4 py-12 sm:py-20 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left — Text */}
                        <div className={`space-y-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                            {/* Members Only Badge */}
                            <div className="inline-flex items-center gap-2 border border-neutral/30 text-neutral/70 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.2em' }}>
                                <ShieldCheck size={13} />
                                Members Only · IRC Faisalabad
                            </div>

                            {/* Heading */}
                            <div className="space-y-2">
                                <p className="text-neutral/40 text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Islamic Research Center
                                </p>
                                <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-neutral leading-[1.05] tracking-tight">
                                    Where Scholars
                                    <span className="block italic font-bold text-neutral/70">
                                        Find Their Way
                                    </span>
                                </h1>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="h-px w-12 bg-neutral/40" />
                                <p className="text-base-content/55 text-lg leading-relaxed max-w-md" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                                    An exclusive digital archive of Islamic manuscripts, scholarly texts, and research volumes — curated for the members of IRC.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <Link
                                    to="/IRCLibrary"
                                    className="btn btn-neutral btn-lg gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                                    style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.05em' }}
                                >
                                    <BookOpen size={18} />
                                    Enter Library
                                </Link>
                                <Link
                                    to="/IRCLibrary"
                                    className="btn btn-outline btn-neutral btn-lg gap-2 hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                                    style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.05em' }}
                                >
                                    <Search size={18} />
                                    Search Archive
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className={`flex flex-wrap gap-10 pt-2 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                {stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-3xl font-black text-neutral" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.number}</div>
                                        <div className="text-xs text-base-content/40 tracking-widest uppercase mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Decorative */}
                        <div className={`hidden lg:flex justify-center items-center transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="relative">
                                <div className="w-80 h-80 rounded-full border border-neutral/15 flex items-center justify-center">
                                    <div className="w-60 h-60 rounded-full border border-neutral/10 flex items-center justify-center bg-neutral/5">
                                        <div className="w-40 h-40 rounded-full bg-neutral flex items-center justify-center shadow-2xl">
                                            <BookOpen className="w-16 h-16 text-white" strokeWidth={1.2} />
                                        </div>
                                    </div>
                                </div>

                                {/* Rotating arabic text */}
                                <svg className="absolute inset-0 w-80 h-80 animate-spin" style={{ animationDuration: '25s' }} viewBox="0 0 320 320">
                                    <defs>
                                        <path id="circle" d="M 160,160 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0" />
                                    </defs>
                                    <text fill="currentColor" className="text-neutral/30" fontSize="12" letterSpacing="5">
                                        <textPath href="#circle">
                                            اقرأ باسم ربك الذي خلق • اقرأ باسم ربك الذي خلق •
                                        </textPath>
                                    </text>
                                </svg>

                                {/* Subject badges */}
                                <div className="absolute -top-6 -right-2 bg-base-100 border border-base-300 rounded-2xl px-4 py-2 shadow-lg text-sm text-neutral font-medium animate-bounce" style={{ animationDuration: '3s', fontFamily: "'Lato', sans-serif" }}>
                                    📚 فقہ
                                </div>
                                <div className="absolute -bottom-6 -left-2 bg-base-100 border border-base-300 rounded-2xl px-4 py-2 shadow-lg text-sm text-neutral font-medium animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s', fontFamily: "'Lato', sans-serif" }}>
                                    📖 تفسیر
                                </div>
                                <div className="absolute top-1/2 -right-16 bg-base-100 border border-base-300 rounded-2xl px-4 py-2 shadow-lg text-sm text-neutral font-medium animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s', fontFamily: "'Lato', sans-serif" }}>
                                    ✨ حدیث
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 leading-none">
                    <svg viewBox="0 0 1440 80" className="w-full block fill-base-200">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>
        </>
    )
}