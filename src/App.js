import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";
import "./App.css"
import Survey from "./Survey";
import ResultsPage from "./pages/ResultsPage";

function App() {
  const [user, setUser] = useState(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

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
    signOut(auth);
    setUser(null);
  };

  const handleSurveyCompletion = () => {
    setSurveyCompleted(true); // Set surveyCompleted to true when the survey is done
  };

  return (
    <div>
      {user ? (
        <>
          <header>
            <button onClick={logOut}>Sign Out</button>
          </header>
          {surveyCompleted ? (
            <ResultsPage user={user} /> // Show the results page if the survey is completed
          ) : (
            <Survey user={user} onSurveyComplete={handleSurveyCompletion} />
            // Pass handleSurveyCompletion as a prop to the Survey component
          )}
        </>
      ) : (
        <button className="signIn" onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
