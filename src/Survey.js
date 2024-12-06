import React, { useState, useEffect } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
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
  const [isSurveyReset, setIsSurveyReset] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSurveyStatus = async () => {
      const userId = user.uid;
      const docRef = doc(db, "surveyResponses", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const lastSubmissionDate = data.date; // Stored date from Firestore
        const today = new Date().toISOString().split("T")[0];
  
        if (lastSubmissionDate === today) {
          // Survey already completed for today
          navigate("/results");
        } else {
          // Reset the survey for a new day
          setCurrentQuestion(0);
          setAnswers({});
          setRating(null);
          setIsSurveyReset(true);
        }
      } else {
        // No survey data exists; reset for a new survey
        setCurrentQuestion(0);
        setAnswers({});
        setRating(null);
        setIsSurveyReset(true);
      }
    };
  
    checkSurveyStatus();
  }, [user, navigate]);

  const handleNext = async () => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: rating, // Save the rating for the current question
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRating(null); 
      
    } else {
      const updatedAnswers = {
        ...answers,
        [currentQuestion]: rating,
      };

      onSurveyComplete();
      navigate("/results");
      // Save the answers to Firestore
      const userId = user.uid;
      const today = new Date().toISOString().split("T")[0];

      await setDoc(doc(db, "surveyResponses", userId), {
        date: today,
        answers: updatedAnswers,
        userId: userId,
      });
    }
  };

  return (
    <div>
      <h1>Hi {user.displayName}, how are you feeling today?</h1>
      <h2>{questions[currentQuestion]}</h2>
      <Rating key={currentQuestion} onRatingChange={(rating) => setRating(rating)}/>
      <button onClick={handleNext}>
        {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
}

export default Survey;
