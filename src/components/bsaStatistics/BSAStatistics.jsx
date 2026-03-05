import React, { useEffect, useState } from 'react'
import { useBooks } from '@/context/BooksContext';
import { } from 'react';

export const BSAStatistics = () => {

    const { totalBooks, totalSubjects, totalAuthors } = useBooks()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    const stats = [
        { number: totalBooks > 0 ? `${totalBooks}` : "10", label: "Volumes" },
        { number: totalSubjects > 0 ? `${totalSubjects}` : "10", label: "Subjects" },
        { number: totalAuthors > 0 ? `${totalAuthors}` : "10", label: "Authors" },
    ]


    return (
        <>

            <div className="relative font max-w-4xl mb-15 mt-12 sm:mt-16  mx-auto w-full text-center">
                {/* ہورائزنٹل بیم (Horizontal Beam) */}
                {/* <div className="flex justify-center items-center w-full my-8 sm:my-12 px-4">
                    <div className="relative w-full max-w-xs sm:max-w-md h-px bg-slate-200">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-400 to-transparent w-1/2 h-full"
                            style={{ animation: 'beamHorizontal 3s ease-in-out infinite' }} />
                    </div>
                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 divide-y sm:divide-y-0 divide-[oklch(92%_0.04_240)]">
                    <StatCard number={parseInt(stats[0].number)} label={stats[0].label} />
                    <StatCard number={parseInt(stats[1].number)} label={stats[1].label} isMiddle />
                    <StatCard number={parseInt(stats[2].number)} label={stats[2].label} />
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer { 100% { transform: translateX(100%); } }
             @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
             @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
             @keyframes verticalBeam {
               0% { transform: translateY(-100%); }
               100% { transform: translateY(300%); }
             }
           `}} />


        </>

    )

    function StatCard({ number, label, isMiddle }) {
        const [count, setCount] = useState(0);

        useEffect(() => {
            const duration = 2000;
            const steps = 60;
            const stepValue = number / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                setCount(Math.floor(stepValue * currentStep));
                if (currentStep === steps) clearInterval(timer);
            }, duration / steps);

            return () => clearInterval(timer);
        }, [number]);

        return (
            <div className={`flex flex-col items-center py-4 sm:py-0 ${isMiddle ? 'relative' : ''}`}>
                {isMiddle && (
                    <>
                        <div className="hidden sm:block absolute left-0 top-0 w-px h-full bg-[oklch(92%_0.04_240)] overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-linear-to-b from-transparent via-[oklch(50%_0.05_240/0.8)] to-transparent animate-[verticalBeam_3s_linear_infinite]" />
                        </div>
                        <div className="hidden sm:block absolute right-0 top-0 w-px h-full bg-[oklch(92%_0.04_240)] overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-linear-to-b from-transparent via-[oklch(50%_0.05_240/0.8)] to-transparent animate-[verticalBeam_3s_linear_infinite_1.5s]" />
                        </div>
                    </>
                )}
                <span className="text-4xl sm:text-6xl font-bold text-neutral">{count}</span>
                <span className="mt-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-neutral/60">{label}</span>
            </div>
        );
    }
}

