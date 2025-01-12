import { ReactComponent as MatrixGitHubIcon } from "../../assets/matrix-github-icon.svg";
import { ReactComponent as MatrixLinkedInIcon } from "../../assets/matrix-linkedin-icon.svg";

const OverlayText = ({ steps, totalviews }: { steps: number; totalviews: number }) => {
  return (
    <>
      {/* OVERLAY TOP */}
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", color: "#0f0", zIndex: 10 }}>
        <h1 className="responsive-heading">STEFANO SCALFARI</h1>
        <h2 className="responsive-subheading">INITIALIZING MATRIX...</h2>
      </div>

      {/* OVERLAY BOTTOM */}
      <div
        style={{
          position: "absolute",
          bottom: "0%",
          width: "100%",
          textAlign: "center",
          color: "#0f0",
          fontFamily: "Roboto Mono, monospace",
          fontSize: "1.2rem",
          textShadow: "0 0 5px #0f0",
          zIndex: 10,
        }}
      >
        <h3>
          STEPS TAKEN: <span style={{ color: "#fff" }}>{steps}</span>
        </h3>
        <h3>
          TOTAL VIEWS: <span style={{ color: "#fff" }}>{totalviews}</span>
        </h3>
        <div style={{ display: "inline-flex", gap: "1rem" }}>
          <a href="https://github.com/Vorshim92" target="_blank" rel="noopener noreferrer" className="icon-container">
            <div style={{ filter: "drop-shadow(0 0 5px #0f0)" }}>
              <MatrixGitHubIcon />
            </div>
          </a>
          <a href="https://www.linkedin.com/in/stefano-scalfari" target="_blank" rel="noopener noreferrer" className="icon-container">
            <div style={{ filter: "drop-shadow(0 0 5px #0f0)" }}>
              <MatrixLinkedInIcon />
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default OverlayText;
