import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api";

function Upload() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/datasets`)
      .then(res => setDatasets(res.data.datasets))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!target) {
      setError("Please enter a target column.");
      return;
    }

    setLoading(true);

    try {
      let columns;

      // OPTION 1: Load predefined dataset
      if (selectedDataset) {
        const res = await axios.post(`${API}/load_dataset`, new URLSearchParams({
          name: selectedDataset
        }));
        columns = res.data.columns;
      }

      // OPTION 2: Upload file
      else if (file) {
        if (!file.name.endsWith(".csv")) {
          setError("Please upload a CSV file.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(`${API}/upload`, formData);
        columns = res.data.columns;
      }

      else {
        setError("Please upload a file or select a sample dataset.");
        setLoading(false);
        return;
      }

      // Train — backend uses session data from upload/load_dataset
      const trainRes = await axios.post(`${API}/train?target=${target}`);

      localStorage.setItem("columns", JSON.stringify(columns));
      localStorage.setItem("target", target);

      navigate("/results", {
        state: { results: trainRes.data.scores }
      });

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Upload Dataset</h1>

        {error && (
          <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label>Upload CSV File</label><br />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <h3>Or Select Sample Dataset</h3>
        <div style={{ marginBottom: "16px" }}>
          <select onChange={(e) => setSelectedDataset(e.target.value)} value={selectedDataset}>
            <option value="">Select dataset</option>
            {datasets.map(ds => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Target Column</label><br />
          <input
            placeholder="Target column"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Training..." : "Upload & Train"}
        </button>
      </div>
    </Layout>
  );
}

export default Upload;