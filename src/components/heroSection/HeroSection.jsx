import React from 'react';
import {
    ArrowRight,
    BookOpen,
    Search,
    ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function App() {
    return (
        <section className="relative pt-16 pb-2 sm:pt-24 sm:pb-8 flex flex-col justify-center">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M40 0 L52 28 L80 40 L52 52 L40 80 L28 52 L0 40 L28 28 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                            <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#islamic-geo)" className="text-slate-400" />
                </svg>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none blur-3xl opacity-20"
                style={{ background: "oklch(50% 0.05 240 / 0.3)" }} />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto w-full text-center">
                    <div className="flex justify-center mb-6 sm:mb-8 group">
                        <div className="animate-[float_4s_easeInOut_infinite] relative">
                            <div className="relative p-px rounded-full overflow-hidden">
                                <div className="absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,oklch(50%_0.05_240/0.4)_180deg,transparent_210deg)]" />
                                <div className="relative inline-flex items-center gap-2 px-5 py-3 rounded-full bg-base-100 backdrop-blur-xl border border-[oklch(50%_0.05_240/0.4)] shadow-inner">
                                    <ShieldCheck size={14} className="text-neutral animate-[pulse_2s_infinite] shrink-0" strokeWidth={2.5} />
                                    <span className="text-[10px] sm:text-xs font-bold tracking-widest sm:tracking-[0.20em] text-neutral uppercase whitespace-nowrap">
                                        MEMBERS ONLY • IRC FAISALABAD
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -inset-2 bg-[oklch(50%_0.05_240/0.1)] blur-2xl rounded-full -z-10" />
                        </div>
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <p className="text-neutral/45 text-[9px] sm:text-xs tracking-[0.3em] sm:tracking-[0.5em] uppercase font-semibold">
                            Islamic Research Center
                        </p>
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-serif font-bold text-neutral leading-[1.2] sm:leading-[1.1] mb-6 sm:mb-8">
                        Where Scholars <br />
                        <span className="italic font-light text-neutral/80 text-3xl sm:text-5xl lg:text-7xl">Find Books</span>
                    </h1>
                    <p className="text-sm sm:text-lg text-[oklch(40%_0.02_240)] leading-relaxed max-w-xl mx-auto mb-8 sm:mb-12 px-2">
                        A premier digital repository of Islamic manuscripts and scholarly research — exclusively curated for the IRC community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 w-full max-w-sm sm:max-w-none mx-auto">
                        <Link to="/IRCLibrary" className='w-80 sm:w-auto'>
                            <button className="relative group cursor-pointer overflow-hidden w-full sm:w-auto min-w-50 px-8 py-3.5 sm:py-4 rounded-xl bg-neutral text-base-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-base-100 flex items-center justify-center gap-3">
                                <div className="absolute inset-0 bg-gradient-to-r from-[oklch(50%_0.05_240)] via-[oklch(55%_0.05_240)] to-[oklch(50%_0.05_240)]" />
                                <BookOpen size={18} strokeWidth={2} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10 font-bold tracking-wide text-sm sm:text-base">Enter Library</span>
                                <ArrowRight size={16} className="relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            </button>
                        </Link>
                        <Link to="/IRCLibrary" className='w-80 sm:w-auto'>
                            <button className="relative group cursor-pointer overflow-hidden w-full sm:w-auto min-w-50 px-8 py-3.5 sm:py-4 rounded-xl bg-base-100 border border-neutral transition-all hover:bg-neutral/10 text-neutral duration-300 flex items-center justify-center gap-3 shadow-sm">
                                <Search size={18} strokeWidth={2} className="relative z-10 text-neutral group-hover:scale-110 transition-transform duration-300" />
                                <span className="relative z-10 font-bold tracking-wide text-sm">Search Archive</span>
                                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-[oklch(50%_0.05_240/0.05)] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}