import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function ResultsPage({ user }) {
  async function fetchSurveyResponses(userId) {
    console.log("here");
    const docRef = doc(db, "surveyResponses", userId);
    console.log('here4');
    try {
      const docSnap = await getDoc(docRef);
      console.log('here5');
    
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async function loadResults() { // Replace with the actual user ID
    console.log('here2');
    const surveyData = await fetchSurveyResponses(user.uid);
    console.log("here3");
  
    if (surveyData) {
      console.log("Survey Answers:", surveyData.answers);
      console.log("Survey Date:", surveyData.date);
    }
    else {
      console.log("error")
    }
  }

  return (
    <div>
      <h1>Results</h1>
      <button onClick={loadResults}></button>
    </div>
  );
}

export default ResultsPage;
