import React from "react";

interface userReview {
    rating: number;
  } ;

const StarRating: React.FC<userReview> = ({ rating }) => {
  // Create an array of 5 elements representing stars
  const stars = Array.from({ length: 5 }, (_, index) => {
    // Determine if the current star is full, half or empty
    if (rating >= index + 1) {
      return "full";  // Full star
    } else if (rating >= index + 0.5) {
      return "half";  // Half star
    } else {
      return "empty";  // Empty star
    }
  });

  return (
    <div className="flex space-x-1">
      {stars.map((star, index) => (
        <span key={index}>
          {star === "full" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className="w-6 h-6 text-yellow-500"
            >
              <path
                fillRule="evenodd"
                d="M12 17.75l-6.553 3.444 1.255-7.319L1.4 8.85l7.355-1.069L12 .84l3.245 6.941 7.355 1.069-5.301 5.025 1.255 7.319L12 17.75z"
                clipRule="evenodd"
              />
            </svg>
          ) : star === "half" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className="w-6 h-6 text-yellow-500"
            >
              <path
                d="M12 17.75l-6.553 3.444 1.255-7.319L1.4 8.85l7.355-1.069L12 .84v16.91z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className="w-6 h-6 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.75l-6.553 3.444 1.255-7.319L1.4 8.85l7.355-1.069L12 .84l3.245 6.941 7.355 1.069-5.301 5.025 1.255 7.319L12 17.75z"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
