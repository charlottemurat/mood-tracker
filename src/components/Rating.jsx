import React, { useState } from "react";
import './Rating.css'; // Importing CSS for styling

function Rating({ onRatingChange }) {
  const [selectedRating, setSelectedRating] = useState(null); // State to track the selected number

  // Function to handle clicking on a circle
  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  return (
    <div className="rating-container">
      {[1, 2, 3, 4, 5].map((number) => (
        <div
          key={number}
          className={`circle ${selectedRating === number ? "selected" : ""}`}
          onClick={() => handleRatingClick(number)}
        >
          {number}
        </div>
      ))}
    </div>
  );
}

export default Rating;