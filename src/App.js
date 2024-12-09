import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";
import "./styles/App.css"
import Survey from "./Survey";
import ResultsPage from "./pages/ResultsPage";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const navigate = useNavigate();

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        setUser(result.user);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const logOut = () => {
    navigate("/");
    signOut(auth);
    setUser(null);
  };

  const handleSurveyCompletion = () => {
    setSurveyCompleted(true); // Set surveyCompleted to true when the survey is done
  };
  
  function toResults() {
    console.log("navigating")
    navigate("/results");
    console.log("navigated")
  }

  return (
    <div>
      {user ? (
        <> 
          <div id="header-top">
          <Link href="/results">Go to Results</Link>
              <button id="sign-out-button" onClick={logOut}>sign out</button>
              <button id="view-log-button" onClick={toResults}>view mood log</button>
          </div>
          <div id="header-bottom"></div>
          {surveyCompleted ? (
            <ResultsPage user={user} /> // Show the results page if the survey is completed
          ) : (
            <Survey user={user} onSurveyComplete={handleSurveyCompletion} />
            // Pass handleSurveyCompletion as a prop to the Survey component
          )}
        </>
      ) : (
        <div className="sign-in">
          <div id="title">
          <h1 id="mood-text">Mood</h1><h1 id="tracker-text">Tracker</h1>
          </div>
        <button id="sign-in-button" onClick={signIn}>sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default App;
