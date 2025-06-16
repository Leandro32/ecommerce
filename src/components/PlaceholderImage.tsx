import React from "react";

interface PlaceholderImageProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: "product" | "avatar" | "general";
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  className = "",
  size = "md",
  type = "product",
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Check if className contains sizing constraints
  const hasCustomSize =
    className.includes("w-") ||
    className.includes("h-") ||
    className.includes("aspect-");

  const getIcon = () => {
    switch (type) {
      case "product":
        return (
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Background circle */}
            <circle cx="40" cy="40" r="32" fill="currentColor" opacity="0.1" />
            {/* Image frame */}
            <rect
              x="20"
              y="20"
              width="40"
              height="40"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            {/* Mountain/landscape icon */}
            <path
              d="M20 52L28 44L34 50L48 36L60 48V56C60 57.1046 59.1046 58 58 58H22C20.8954 58 20 57.1046 20 56V52Z"
              fill="currentColor"
              opacity="0.3"
            />
            {/* Sun/circle */}
            <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.4" />
            {/* Package/box icon overlay */}
            <rect
              x="32"
              y="28"
              width="16"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M32 32L40 28L48 32"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M40 28V44"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "avatar":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="8.5"
              cy="8.5"
              r="1.5"
              fill="currentColor"
              opacity="0.5"
            />
            <path
              d="M21 15L16 10L13 13"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 15L13 10L21 18"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        flex items-center justify-center
        bg-default-100 text-default-400
        ${hasCustomSize ? "" : sizeClasses[size]}
        ${className}
      `}
      role="img"
      aria-label="Placeholder image"
    >
      <div className={`opacity-50 ${hasCustomSize ? "w-full h-full" : "w-16 h-16"}`}>
        {getIcon()}
      </div>
    </div>
  );
};

export default PlaceholderImage;
