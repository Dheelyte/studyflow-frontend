export const ResultsView = ({
  enter = 1,
  scoreValue = 100,
  scoreScale = 1,
  messageReveal = 1,
  subtextReveal = 1,
  buttonReveal = 1,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 16,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: "8px solid #10b981",
          background: "rgba(16, 185, 129, 0.06)",
          color: "#10b981",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: -1,
          boxShadow: `0 0 ${30 + scoreScale * 20}px rgba(16, 185, 129, ${0.25 + (scoreScale - 1) * 0.6})`,
          transform: `scale(${scoreScale})`,
          marginBottom: 8,
        }}
      >
        {scoreValue}%
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          color: "#111827",
          transform: `translateY(${(1 - messageReveal) * 12}px)`,
          opacity: messageReveal,
        }}
      >
        Excellent Work!
      </h2>

      <p
        style={{
          margin: 0,
          fontSize: 15,
          color: "#6b7280",
          maxWidth: 420,
          lineHeight: 1.5,
          transform: `translateY(${(1 - subtextReveal) * 10}px)`,
          opacity: subtextReveal,
        }}
      >
        You passed the Foundations of Data Analysis quiz!
      </p>

      <div
        style={{
          marginTop: 16,
          transform: `translateY(${(1 - buttonReveal) * 10}px) scale(${0.96 + buttonReveal * 0.04})`,
          opacity: buttonReveal,
        }}
      >
        <button
          style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 12px 28px -8px rgba(99, 102, 241, 0.6)",
          }}
        >
          Complete & Continue
        </button>
      </div>
    </div>
  );
};
