import React, { useState } from 'react';

export const ImageSlideshow: React.FC<{ images: string[] }> = ({ images }) => {
    const [index, setIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev + 1) % images.length);
    };
    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group aspect-video flex items-center justify-center">
            <img
                src={images[index]}
                alt={`Image ${index + 1}`}
                className="max-w-full max-h-full object-contain transition-all duration-500"
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                        {index + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
};
