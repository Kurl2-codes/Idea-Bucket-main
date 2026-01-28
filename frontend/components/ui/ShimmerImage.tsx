import React, { useState } from 'react';

interface ShimmerImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

const ShimmerImage: React.FC<ShimmerImageProps> = ({ src, alt, className = "", containerClassName = "" }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative w-full h-full ${containerClassName}`}>
            {!isLoaded && (
                <div className="absolute inset-0 shimmer" />
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};

export default ShimmerImage;
