import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Upload from "./pages/Upload";
import Results from "./pages/Results";
import EDA from "./pages/EDA";
import Predictor from "./pages/Predictor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/eda" element={<EDA />} />
        <Route path="/predictor" element={<Predictor />} />
      </Routes>
    </Router>
  );
}

export default App;