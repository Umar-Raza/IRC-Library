import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    BookOpen,
    Search,
    ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function App() {
    // اینیمیشن ختم کرنے کے لیے ہم 'isLoaded' کو براہ راست ٹرو یا اسے استعمال نہ کرنے کا فیصلہ کر سکتے ہیں
    // یہاں میں نے کنٹینٹ سے ٹرانزیشن کلاسز ہٹا دی ہیں۔

    return (
        <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-24 flex flex-col justify-center">

            {/* 1. پس منظر کا نمونہ (Background Pattern) */}
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

            {/* 2. مرکزی مواد (Main Content) - اینیمیشن کلاسز ہٹا دی گئی ہیں */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto w-full text-center">
                    {/* پریمیم بیج (Premium Badge) */}
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

                    {/* ایکشن بٹنز (Action Buttons) */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 w-full max-w-sm sm:max-w-none mx-auto">

                        <Link to="/readerRegister" className='w-80 sm:w-auto'>
                            <button className="relative group cursor-pointer overflow-hidden w-full sm:w-auto min-w-50 px-8 py-3.5 sm:py-4 rounded-xl bg-neutral text-base-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-base-100 flex items-center justify-center gap-3">
                                <div className="absolute inset-0 bg-gradient-to-r from-[oklch(50%_0.05_240)] via-[oklch(55%_0.05_240)] to-[oklch(50%_0.05_240)]" />
                                <BookOpen size={18} strokeWidth={2} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10 font-bold tracking-wide text-sm sm:text-base">Enter Library</span>
                                <ArrowRight size={16} className="relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            </button>
                        </Link>
                        <Link to="/IRCLibrary" className='w-80 sm:w-auto'>
                            <button className="relative group cursor-pointer overflow-hidden w-full sm:w-auto min-w-50 px-8 py-3.5 sm:py-4 rounded-xl bg-base-100 border border-neutral transition-all hover:bg-neutral/10 text-neutral   duration-300  flex items-center justify-center gap-3 shadow-sm">
                                <Search size={18} strokeWidth={2} className="relative z-10 text-neutral group-hover:scale-110 transition-transform duration-300" />
                                <span className="relative z-10 font-bold tracking-wide text-sm ">Search Archive</span>
                                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-[oklch(50%_0.05_240/0.05)] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            </button>
                        </Link>
                    </div>

                    {/* ہورائزنٹل بیم (Horizontal Beam) */}
                    <div className="flex justify-center items-center w-full my-8 sm:my-12 px-4">
                        <div className="relative w-full max-w-xs sm:max-w-md h-px bg-slate-200">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-400 to-transparent w-1/2 h-full"
                                style={{ animation: 'beamHorizontal 3s ease-in-out infinite' }} />
                        </div>
                    </div>
                    {/* اعداد و شمار (Statistics) */}
                    <div className="relative pb-8 sm:pb-0">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 divide-y sm:divide-y-0 divide-[oklch(92%_0.04_240)]">

                            <div className="flex flex-col items-center py-4 sm:py-0">
                                <span className="text-4xl sm:text-6xl font-serif font-bold text-neutral">75</span>
                                <span className="mt-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-neutral/60">Volumes</span>
                            </div>

                            {/* درمیانی کالم جس میں دائیں بائیں بیم ہیں */}
                            <div className="relative flex flex-col items-center py-4 sm:py-0">
                                {/* بایاں بیم (Left Vertical Beam) */}
                                <div className="hidden sm:block absolute left-0 top-0 w-px h-full bg-[oklch(92%_0.04_240)] overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-[oklch(50%_0.05_240/0.8)] to-transparent animate-[verticalBeam_3s_linear_infinite]" />
                                </div>

                                <span className="text-4xl sm:text-6xl font-serif font-bold text-neutral">20<span className="text-xl sm:text-2xl font-light opacity-30 ml-1">+</span></span>
                                <span className="mt-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-neutral/60">Subjects</span>

                                {/* دایاں بیم (Right Vertical Beam) */}
                                <div className="hidden sm:block absolute right-0 top-0 w-px h-full bg-[oklch(92%_0.04_240)] overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-[oklch(50%_0.05_240/0.8)] to-transparent animate-[verticalBeam_3s_linear_infinite_1.5s]" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center py-4 sm:py-0">
                                <span className="text-4xl sm:text-6xl font-serif font-bold text-neutral">25<span className="text-xl sm:text-2xl font-light opacity-30 ml-1">+</span></span>
                                <span className="mt-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-neutral/60">Authors</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
           @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes beamHorizontal {
          0% { transform: translateX(-200%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
        @keyframes verticalBeam {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}} />
        </section>
    );
}