import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";
import Survey from "./Survey";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Survey />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}
export default App;
