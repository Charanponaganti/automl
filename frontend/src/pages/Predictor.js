import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
import Layout from "../components/Layout";
import './styles/Predictor.css';

function safeParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default function Predictor() {
  const rawColumns = localStorage.getItem("automl_columns");
  let target = localStorage.getItem("automl_target");

  const [input, setInput] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedColumns = safeParseJSON(rawColumns);
  const parsedRedundant = safeParseJSON(localStorage.getItem("automl_redundant_features"));
  const columns = Array.isArray(parsedColumns) ? parsedColumns : [];
  const redundantFeatures = Array.isArray(parsedRedundant) ? parsedRedundant : [];

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  // Create lowercase mapping (JS version of your Python logic)
  const colMap = Object.fromEntries(
    columns.map((col) => [col.toLowerCase(), col]),
  );

  const targetLower = target ? target.trim().toLowerCase() : null;

  target = targetLower && colMap[targetLower];

  // Guard: no session data
  if (!rawColumns || !target) {
    return (
      <Layout>
        <div className="pred-root">
          <div className="pred-wrap">
            <div className="guard-card">
              <div className="guard-icon" style={{ color: "#f87171" }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="guard-title" style={{ color: "#f87171" }}>
                No session data found
              </div>
              <div className="guard-sub">
                Train a model first before running predictions.
              </div>
              <button
                className="ghost-btn"
                onClick={() => (window.location.href = "/")}
              >
                Go to Upload
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const inputCols = columns.filter(
    (col) => col !== target && !redundantFeatures.includes(col),
  );

  const handleChange = (col, value) => {
    setInput((prev) => ({
      ...prev,
      [col]:
        columnTypes[col]?.type === "numeric"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleBulkFileChange = (file) => {
    setBulkFile(file);
    setDownloadUrl("");
    setDownloadName("");
    setError("");
  };

  const handlePredictDataset = async () => {
    setError("");
    if (!bulkFile) {
      setError("Choose a CSV file to run batch prediction.");
      return;
    }
    if (!bulkFile.name.toLowerCase().endsWith(".csv")) {
      setError("Bulk prediction requires a .csv file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", bulkFile);
      const res = await axios.post(`${API}/predict_dataset`, formData, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`predictions_${bulkFile.name}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Bulk prediction failed. Please upload a dataset with the same original structure.",
      );
    } finally {
      setLoading(false);
    }
  };

  const rawTypes = localStorage.getItem("automl_types");
  const parsedTypes = safeParseJSON(rawTypes);
  const columnTypes =
    parsedTypes && typeof parsedTypes === "object" ? parsedTypes : {};

  const handlePredict = async () => {
    setError("");
    const missing = inputCols.filter(
      (col) => input[col] === undefined || input[col] === "",
    );
    if (missing.length > 0) {
      setError(
        `Fill in all fields before predicting. Missing: ${missing.join(", ")}`,
      );
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/predict`, input);
      setPrediction(res.data.prediction);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Prediction failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pred-root">
        <div className="pred-wrap">
          {/* Header */}
          <div className="page-header">
            <div className="page-eyebrow">AutoML · Inference</div>
            <h1 className="page-title">
              Run a <span>Prediction</span>
            </h1>
          </div>

          {/* Target badge */}
          <div>
            <div className="target-badge">
              <span className="target-badge-label">Target →</span>
              {target}
            </div>
          </div>

          {/* Batch prediction card */}
          <div className="pred-card">
            <div className="card-bar gold" />
            <div className="card-body">
              <div className="section-label">Batch CSV Prediction</div>
              <div className="field-wrap">
                <div className="field-label">Upload dataset</div>
                <input
                  className="styled-input"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleBulkFileChange(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="field-wrap">
                <div className="field-label">File to predict</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>
                  Upload a CSV with the same columns as the original dataset.
                </div>
              </div>
              <button
                className={`submit-btn${loading ? " loading" : ""}`}
                onClick={handlePredictDataset}
                disabled={loading}
              >
                {loading && <div className="spinner" />}
                {loading ? "Generating predictions…" : "Predict CSV"}
              </button>
              {downloadUrl && (
                <a
                  className="submit-btn"
                  style={{ marginTop: 12, background: 'transparent', color: '#63d2b3', border: '1px solid rgba(99,210,179,0.3)' }}
                  href={downloadUrl}
                  download={downloadName}
                >
                  Download predictions
                </a>
              )}
            </div>
          </div>

          {/* Input card */}
          <div className="pred-card">
            <div className="card-bar" />
            <div className="card-body">
              <div className="section-label">Feature Inputs</div>

              {error && (
                <div className="error-box">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="input-grid">
                {inputCols.map((col) => (
                  <div className="field-wrap" key={col}>
                    <div className="field-label">
                      <div className="field-label-dot" />
                      {col}
                    </div>

                    {columnTypes[col]?.type === "categorical" ? (
                      <select
                        className="styled-input"
                        value={input[col] ?? ""}
                        onChange={(e) => handleChange(col, e.target.value)}
                      >
                        <option value="">Select</option>
                        {columnTypes[col].values.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="styled-input"
                        type="number"
                        placeholder="enter value"
                        value={input[col] ?? ""}
                        onChange={(e) => handleChange(col, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                className={`submit-btn${loading ? " loading" : ""}`}
                onClick={handlePredict}
                disabled={loading}
              >
                {loading && <div className="spinner" />}
                {loading ? "Running inference…" : "Predict"}
              </button>
            </div>
          </div>

          {/* Result */}
          {prediction !== null && (
            <div className="result-card">
              <div className="result-bar" />
              <div className="result-body">
                <div className="result-left">
                  <div className="result-icon">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="result-meta">
                    <div className="result-tag">Prediction Output</div>
                    <div className="result-target">{target}</div>
                  </div>
                </div>
                <div className="result-value">
                  {Array.isArray(prediction) ? prediction[0] : prediction}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
