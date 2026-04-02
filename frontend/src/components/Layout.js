import React from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <h2>Web portal :)</h2>
        <div>
          <span onClick={() => navigate("/")} style={styles.link}>Upload</span>
          <span onClick={() => navigate("/results")} style={styles.link}>Results</span>
          <span onClick={() => navigate("/eda")} style={styles.link}>EDA</span>
          <span onClick={() => navigate("/predictor")} style={styles.link}>Predictor</span>
        </div>
      </div>

      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  page: {
    background: "#020617",
    minHeight: "100vh",
    
    color: "white",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: "1px solid #1e293b",
  },
  link: {
    marginLeft: "20px",
    cursor: "pointer",
    color: "#38bdf8",
  },
  content: {
    padding: "40px",
  },
};

export default Layout;