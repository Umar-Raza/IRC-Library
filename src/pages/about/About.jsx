import React from 'react'
import { BookOpen, Users, ShieldCheck, Scroll, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const About = () => {


    const features = [
        {
            icon: <Scroll className="w-5 h-5" />,
            title: "Exclusive Collection",
            desc: "Access rare Tafseer, Hadith, and Fiqh manuscripts preserved specifically for IRC research."
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: "Scholarly Archive",
            desc: "A curated digital repository of classical texts and contemporary Islamic sciences."
        },
        {
            icon: <ShieldCheck className="w-5 h-5" />,
            title: "Restricted Access",
            desc: "Security-first platform ensuring that sensitive research material remains within the IRC circle."
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Verified Members",
            desc: "Exclusively accessible to registered IRC scholars and authorized researchers only."
        },
    ]

    return (
        <section
            id='about' className="relative z-10 container mx-auto mb-5 px-4 sm:px-47 overflow-hidden"
        >
            {/* ── Header ── */}
            <div className="text-center mb-16">
                <h2 className="text-2xl sm:text-5xl underline font-sans font-bold text-neutral leading-[1.15] mb-10">
                    About
                </h2>
                <h3 className="italic font-light font-serif text-neutral/70 text-3xl mb-5 sm:text-5xl">
                    Built for Scholars
                </h3>
                <p className="text-sm sm:text-base text-[oklch(40%_0.02_240)] leading-relaxed max-w-2xl mx-auto">
                    The <span className="font-semibold text-neutral">Islamic Research Center (IRC)</span> digital
                    library is established by — Dawat-e-Islami, Faisalabad.
                    A rare collection of Islamic manuscripts, Tafaseer, Ahadith and Fiqh literature —
                    exclusively accessible to verified IRC members, anytime and anywhere.
                </p>
            </div>
            {/* ── Feature cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="group relative rounded-xl p-6 border border-base-300 bg-base-100 hover:bg-base-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-default overflow-hidden"
                        style={{ transitionDelay: `${i * 60}ms` }}
                    >
                        {/* shimmer */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                            style={{ background: "linear-gradient(135deg, oklch(98% 0.02 240 / 0.6) 0%, transparent 60%)" }} />
                        <div className="w-10 h-10 rounded-lg bg-base-200 group-hover:bg-base-300 flex items-center justify-center mb-4 text-neutral transition-all duration-300 group-hover:scale-110">
                            {f.icon}
                        </div>
                        <h3 className="font-bold text-sm text-neutral mb-2 font-serif">
                            {f.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-[oklch(40%_0.02_240)]">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
            <div className="relative rounded-xl overflow-hidden border border-base-300 bg-neutral">
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                    style={{ background: "oklch(50% 0.05 240 / 0.1)" }} />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-base-100/80 mb-2">
                            Get in Touch
                        </p>
                        <p className="text-lg font-bold font-serif text-base-100 leading-relaxed mb-1">
                            Al-Madinatul Ilmiyyah — Dawat-e-Islami, Faisalabad
                        </p>
                        <a href="mailto:almadinatulilmia.fsd@dawateislami.net"
                            className="text-sm text-base-100 transition-colors hover:underline">
                            almadinatulilmia.fsd@dawateislami.net
                        </a>
                    </div>
                    <Link to="/readerRegister" className="shrink-0">
                        <button className="relative group cursor-pointer overflow-hidden px-7 py-3.5 rounded-xl bg-neutral text-neutral transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center gap-3">
                            <div className="absolute inset-0 bg-gradient-to-r from-base-100  via-base-100 to-base-100" />
                            <span className="relative z-10 font-bold tracking-wide text-sm">
                                Request Membership
                            </span>
                            <ArrowRight size={16} className="relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        </button>
                    </Link>
                </div>
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <svg className="absolute inset-0 w-full h-full text-base-100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="islamic-geo-about" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                                <path d="M40 0 L52 28 L80 40 L52 52 L40 80 L28 52 L0 40 L28 28 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                                <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#islamic-geo-about)" className="text-slate-400" />
                    </svg>
                </div>
            </div>
        </section>
    )
}