import React, { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import Rating from "./components/Rating";

function Survey({ user, onSurveyComplete }) {
  const questions = [
    "What was your best mood during the day?",
    "What was your worst mood during the day?",
    "How much power did you feel you had in your battery?",
    "Were you worried/fearful?",
    "How would you rate your irritability?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [rating, setRating] = useState(null);

  const handleNext = async () => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: rating, // Save the rating for the current question
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRating(null);
    } else {
      // Save the answers to Firestore
      const userId = user.uid;
      const today = new Date().toISOString().split("T")[0];

      await setDoc(doc(db, "surveyResponses", userId), {
        date: today,
        answers: answers,
        userId: userId,
      });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    onSurveyComplete();
    navigate("/results")
  }

  return (
    <div>
      <h1>Hi {user.displayName}, how are you feeling today?</h1>
      <h2>{questions[currentQuestion]}</h2>
      <Rating key={currentQuestion} onRatingChange={(rating) => setRating(rating)}/>
      <button onClick={currentQuestion < questions.length - 1 ? handleNext : handleSubmit}>
        {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
}

export default Survey;
