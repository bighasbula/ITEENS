'use client'

// components/Footer.jsx
export default function Footer() {
    return (
      <footer className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4"
      style={{ fontSize: "1.0rem", textAlign: "center", marginTop: "1rem"}}>
        Developed by Bulatzhan
        <br />
        <a className="text-lg sm:text-xl font-semibold text-muted-foreground" href="https://github.com/bighasbula" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", fontSize: "1.0rem" }}>
          Github
        </a>
        <a className="text-lg sm:text-xl font-semibold text-muted-foreground" href="https://x.com/bulacrazy" target="_blank" rel="noopener noreferrer" style={{marginLeft: "1rem", textDecoration: "underline", fontSize: "1.0rem"}}>
          Twitter
        </a>
      </footer>
    );
  }
  