import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results || {};

  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const best = sorted[0];

  return (
    <Layout>
      <div style={{ padding: "40px", color: "white" }}>
        <h1>🏆 Model Results</h1>

        <h2>Best Model: {best?.[0]}</h2>

        {sorted.map(([model, score], i) => (
          <div key={model}>
            #{i + 1} — {model} → {score.toFixed(4)}
          </div>
        ))}

        <button onClick={() => navigate("/eda")}>
          Go to EDA →
        </button>
      </div>
    </Layout>
  );
}

export default Results;