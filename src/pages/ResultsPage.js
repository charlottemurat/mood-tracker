import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import LineChart from "../components/LineChart";

function ResultsPage({ user }) {
  async function fetchSurveyResponses(userId) {
    const docRef = doc(db, "surveyResponses", userId);
    try {
      const docSnap = await getDoc(docRef);
    
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
    const surveyData = await fetchSurveyResponses(user.uid);
  
    if (surveyData) {
      console.log("Survey Answers:", surveyData.answers);
      console.log("Survey Date:", surveyData.date);
    }
    else {
      console.log("error")
    }

    return (
      <LineChart chartData={surveyData.answers} />  
    )
  }

  useEffect(() => {
    loadResults();
  }); 

  return (
    <div>
      <h1>Results</h1>
    </div>
  );
}

export default ResultsPage;
