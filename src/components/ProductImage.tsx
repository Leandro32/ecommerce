import React from "react";
import PlaceholderImage from "./PlaceholderImage";

interface ProductImageProps {
  src: string | string[];
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  loading?: "lazy" | "eager";
  sizes?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = "",
  fallbackSrc,
  onError,
  loading = "lazy",
  sizes,
}) => {
  const [imageState, setImageState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [currentSrc, setCurrentSrc] = React.useState<string>("");
  const [hasAttemptedFallback, setHasAttemptedFallback] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Get the primary image source
  const primarySrc = React.useMemo(() => {
    if (Array.isArray(src)) {
      return src.length > 0 ? src[0] : "";
    }
    return src || "";
  }, [src]);

  // Initialize current source
  React.useEffect(() => {
    if (primarySrc) {
      setCurrentSrc(primarySrc);
      setImageState("loading");
      setHasAttemptedFallback(false);
    } else {
      setImageState("error");
    }
  }, [primarySrc]);

  const handleImageLoad = React.useCallback(() => {
    setImageState("loaded");
  }, []);

  const handleImageError = React.useCallback(() => {
    console.warn(`Failed to load image: ${currentSrc}`);

    // If we have multiple sources, try the next one first
    if (Array.isArray(src) && src.length > 1) {
      const currentIndex = src.indexOf(currentSrc);
      if (currentIndex !== -1 && currentIndex < src.length - 1) {
        const nextSrc = src[currentIndex + 1];
        console.log(`Trying next image source: ${nextSrc}`);
        setCurrentSrc(nextSrc);
        setImageState("loading");
        return;
      }
    }

    // Try fallback image if available and not already attempted
    if (
      fallbackSrc &&
      !hasAttemptedFallback &&
      currentSrc !== fallbackSrc &&
      fallbackSrc.startsWith("http")
    ) {
      console.log(`Attempting fallback image: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setHasAttemptedFallback(true);
      setImageState("loading");
      return;
    }

    // All sources failed, show placeholder
    setImageState("error");
    onError?.();
  }, [currentSrc, fallbackSrc, hasAttemptedFallback, src, onError]);

  // Cleanup function to prevent memory leaks
  React.useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      imgElement.addEventListener("load", handleImageLoad);
      imgElement.addEventListener("error", handleImageError);

      return () => {
        imgElement.removeEventListener("load", handleImageLoad);
        imgElement.removeEventListener("error", handleImageError);
      };
    }
  }, [handleImageLoad, handleImageError]);

  // Show placeholder if no source or error state
  if (!currentSrc || imageState === "error") {
    return (
      <div className={`relative ${className}`}>
        <PlaceholderImage
          className="w-full h-full absolute inset-0"
          type="product"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {imageState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-default-100 animate-pulse">
          <div className="w-8 h-8 text-default-400 opacity-60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin"
            >
              <path
                d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        className={`
          w-full h-full object-cover transition-opacity duration-200
          ${imageState === "loaded" ? "opacity-100" : "opacity-0"}
        `}
        onLoad={handleImageLoad}
        onError={handleImageError}
        draggable={false}
      />
    </div>
  );
};

export default ProductImage;
