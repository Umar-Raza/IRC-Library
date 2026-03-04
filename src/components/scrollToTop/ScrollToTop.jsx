import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`
                fixed bottom-8 right-6 z-50
                w-11 h-11 rounded-full
                cursor-pointer
                bg-neutral text-white
                flex items-center justify-center
                shadow-lg
                transition-all duration-300 ease-in-out
                hover:bg-neutral/70 hover:scale-110 hover:shadow-xl
                active:scale-95
                ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'}
            `}
        >
            <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
    );
};