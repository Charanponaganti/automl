import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import API from "../api";
import { useNavigate } from "react-router-dom";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie
} from "recharts";

function EDA() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/eda`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load EDA");
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <Layout>
      <div style={{ padding: "40px", color: "white" }}>
        <h1>📊 EDA Dashboard</h1>

        {/* Columns */}
        <h3>Columns</h3>
        {data.columns.map(col => (
          <span key={col} style={{ margin: "5px" }}>{col}</span>
        ))}

        {/* Sample */}
        <h3>Sample Data</h3>
        <table>
          <thead>
            <tr>
              {data.columns.map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.sample.map((row, i) => (
              <tr key={i}>
                {data.columns.map(col => (
                  <td key={`${i}-${col}`}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------------- HISTOGRAMS ---------------- */}
        <h3>📈 Histograms</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {data.histograms && Object.entries(data.histograms).map(([col, values]) => (
            <div key={col} style={{ background: "#1e1e1e", padding: "10px", borderRadius: "10px" }}>
              <h4>{col}</h4>
              <BarChart width={350} height={250} data={values}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bin" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </div>
          ))}
        </div>

        {/* ---------------- PIE CHARTS ---------------- */}
        <h3>🥧 Categorical Distribution</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {data.categorical && Object.entries(data.categorical).map(([col, values]) => {
            const chartData = Object.entries(values).map(([k, v]) => ({
              name: k,
              value: v
            }));

            return (
              <div key={col}>
                <h4>{col}</h4>
                <PieChart width={300} height={300}>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} />
                  <Tooltip />
                </PieChart>
              </div>
            );
          })}
        </div>

        {/* ---------------- CORRELATION ---------------- */}
        <h3>📊 Correlation Matrix</h3>
        <div style={{ overflowX: "auto" }}>
          <table border="1">
            <thead>
              <tr>
                <th></th>
                {Object.keys(data.correlation).map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.correlation).map(([row, cols]) => (
                <tr key={row}>
                  <td>{row}</td>
                  {Object.values(cols).map((val, i) => (
                    <td key={i}>{val.toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------------- FEATURE IMPORTANCE ---------------- */}
        {data.importance && Object.keys(data.importance).length > 0 && (
          <>
            <h3>🔥 Feature Importance</h3>
            <BarChart width={600} height={300}
              data={Object.entries(data.importance).map(([k, v]) => ({
                name: k,
                value: v
              }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </>
        )}

        {/* ---------------- MISSING VALUES ---------------- */}
        <h3>⚠️ Missing Values</h3>
        <ul>
          {Object.entries(data.missing).map(([col, val]) => (
            <li key={col}>{col}: {val}</li>
          ))}
        </ul>

        {/* ---------------- SUMMARY ---------------- */}
        <h3>📦 Summary Stats</h3>
        <pre style={{ maxHeight: "300px", overflow: "auto" }}>
          {JSON.stringify(data.summary, null, 2)}
        </pre>

        <button onClick={() => navigate("/predictor")}>
          Go to Predictor →
        </button>
      </div>
    </Layout>
  );
}

export default EDA;