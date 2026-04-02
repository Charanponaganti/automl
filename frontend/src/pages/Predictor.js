import { useState } from "react";
import axios from "axios";
import API from "../api";
import Layout from "../components/Layout";

function Predictor() {
  const columns = JSON.parse(localStorage.getItem("columns"));
  const target = localStorage.getItem("target");

  const inputCols = columns.filter(col => col !== target);

  const [input, setInput] = useState({});
  const [prediction, setPrediction] = useState(null);

  const handleChange = (col, value) => {
    setInput({ ...input, [col]: value });
  };

  const handlePredict = async () => {
    const res = await axios.post(`${API}/predict`, input);
    setPrediction(res.data.prediction);
  };

  return (
    <Layout>
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Predict</h1>

        {inputCols.map(col => (
          <input
            key={col}
            placeholder={col}
          onChange={(e) => handleChange(col, Number(e.target.value))}
          />
        ))}

        <button onClick={handlePredict}>Predict</button>

       {prediction && <h2>Prediction: {prediction[0]}</h2>}
      </div>
    </Layout>
  );
}

export default Predictor;