import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";
import Survey from "./pages/SurveyPage";
import Front from "./pages/FrontPage";
import { useState, useEffect } from "react";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Front user={user} setUser={setUser}/>} />
        <Route path="/survey" element={<Survey user={user}/>} />
        <Route path="/results" element={<ResultsPage user={user} setUser={setUser}/>} />
      </Routes>
    </Router>
  );
}
export default App;
