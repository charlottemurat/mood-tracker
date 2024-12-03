import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}
export default App;
