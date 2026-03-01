import { ArrowRight } from 'lucide-react'
import { BookOpen, Search, ShieldCheck, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
    return (
        <section className="min-h-screen bg-linear-to-br from-base-300/10 via-base-100/10 to-base-100/100<ctrl63> relative overflow-hidden pt-20 pb-12 sm:pb-20 lg:pb-24">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="islamic-geo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M50 0 L65 35 L100 50 L65 65 L50 100 L35 65 L0 50 L35 35 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                            <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                            <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.2" opacity="0.1" />
                        </pattern>
                    </defs>
                    <defs>
                        <pattern id="islamic-geo" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                            <rect x="20" y="20" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                            <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                            <path d="M60 40 L80 60 L60 80 L40 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#islamic-geo)" className="text-slate-400" />
                </svg>
            </div>
            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
                <div className="max-w-5xl mx-auto w-full">
                    {/* Premium Badge */}
                    <div className="flex justify-center mb-5 sm:mb-8 mt-12 relative group">
                        <div className="animate-[float_4s_easeInOut_infinite] relative">
                            <div className="relative p-[1px] rounded-full overflow-hidden">
                                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,oklch(50%_0.05_240/0.4)_180deg,transparent_210deg)]" />

                                <div className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-base-100 backdrop-blur-md border border-[oklch(92%_0.04_240)] transition-colors duration-300 overflow-hidden shadow-sm">
                                    <ShieldCheck
                                        size={16}
                                        className="text-[oklch(50%_0.05_240)] animate-[pulse_2s_infinite]"
                                        strokeWidth={2.5}
                                    />
                                    <span
                                        className="text-xs sm:text-sm font-medium tracking-wider text-[oklch(20%_0.05_240)]"
                                        style={{ letterSpacing: '0.08em' }}
                                    >
                                        MEMBERS ONLY • IRC FAISALABAD
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                </div>
                            </div>
                            <div className="absolute -inset-1 bg-[oklch(50%_0.05_240/0.1)] blur-xl rounded-full -z-10 group-hover:bg-[oklch(50%_0.05_240/0.15)] transition-colors" />
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className="text-center mt-1 mb-6 sm:mb-8">
                        <p className="text-neutral/60 text-xs sm:text-sm tracking-widest uppercase" style={{ letterSpacing: '0.35em' }}>
                            Islamic Research Center
                        </p>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-center text-5xl sm:text-6xl md:text-6xl xl:text-8xl font-serif font-bold text-neutral leading-tight mb-6 sm:mb-8 text-balance">
                        Where Scholars
                        <br className="" />
                        <span className="italic font-light text-neutral/80">Find Books</span>
                    </h1>
                    {/* Description */}
                    <p className="text-center sm:text-lg text-neutral/60 tracking-wide leading-relaxed max-w-2xl mx-auto mb-12 sm:mb-16 text-balance">
                        A premier digital repository of Islamic manuscripts and scholarly research — exclusively curated for the IRC community.
                    </p>
                    {/* Action Buttons - Daisy UI Styled */}
                    {/* Action Buttons Section */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto animate-[fadeInUp_1.4s_ease-out]">

                        {/* Primary Action: Enter Library (Now using --color-neutral) */}
                        <Link to="/IRCLibrary">
                            <button className="relative group overflow-hidden px-8 py-3.5 rounded-xl bg-[oklch(50%_0.05_240)] text-[oklch(98%_0.01_240)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[oklch(50%_0.05_240/0.2)] hover:shadow-xl hover:shadow-[oklch(50%_0.05_240/0.3)] flex items-center justify-center gap-3">
                                {/* Animated Background Gradient */}
                                <div className="absolute inset-0 bg-linear-to-r from-[oklch(50%_0.05_240)] via-[oklch(55%_0.05_240)] to-[oklch(50%_0.05_240)] group-hover:from-[oklch(45%_0.05_240)] group-hover:via-[oklch(50%_0.05_240)] group-hover:to-[oklch(45%_0.05_240)] transition-all duration-500" />

                                <BookOpen size={19} strokeWidth={2} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10 font-medium tracking-wide">Enter Library</span>
                                <ArrowRight size={16} className="relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />

                                {/* Subtle Shimmer effect */}
                                <div className="absolute inset-0 w-[200%] bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            </button>
                        </Link>

                        {/* Secondary Action: Search Archive */}
                        <Link to='/IRCLibrary'>
                            <button className="relative group px-8 py-3.5 rounded-xl bg-[oklch(95%_0.03_240)] border border-[oklch(92%_0.04_240)] text-[oklch(20%_0.05_240)] transition-all duration-300 hover:border-[oklch(50%_0.05_240)] hover:bg-[oklch(92%_0.04_240)] flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
                                <Search size={19} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-medium tracking-wide">Search Archive</span>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 rounded-xl bg-[oklch(50%_0.05_240/0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </Link>
                    </div>

                    {/* Divider */}
                    {/* Animated Beam / Decorative Line */}
                    <div className="flex justify-center items-center w-full my-8 overflow-hidden">
                        <div className="relative w-full max-w-md h-px bg-slate-200">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-500 to-transparent w-1/2 h-full"
                                style={{
                                    animation: 'beam 3s ease-in-out infinite'
                                }}
                            />
                        </div>
                        <style>{`
                            @keyframes beam {
                                0% { transform: translateX(-200%); opacity: 0; }
                                50% { opacity: 1; }
                                100% { transform: translateX(200%); opacity: 0; }
                            }
                        `}</style>
                    </div>
                    {/* Statistics Section */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-0 w-full">
                        <div className="flex flex-col items-center justify-center py-6 sm:py-8 border-b sm:border-b-0 sm:border-r border-slate-200/50 last:border-none">
                            <div className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-2">75</div>
                            <p className="text-slate-600 text-xs sm:text-sm font-medium tracking-wider uppercase" style={{ letterSpacing: '0.1em' }}>
                                Volumes
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center py-6 sm:py-8 border-b sm:border-b-0 sm:border-r border-slate-200/50 last:border-none">
                            <div className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-2">
                                20<span className="text-2xl sm:text-3xl font-light">+</span>
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm font-medium tracking-wider uppercase" style={{ letterSpacing: '0.1em' }}>
                                Subjects
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center py-6 sm:py-8 border-b sm:border-b-0 border-slate-200/50 last:border-none">
                            <div className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-2">
                                25<span className="text-2xl sm:text-3xl font-light">+</span>
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm font-medium tracking-wider uppercase" style={{ letterSpacing: '0.1em' }}>
                                Authors
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
