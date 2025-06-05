import React from "react";
import "./Button.css";

export default function Button({ onClick, className = "", children }) {
  return (
    <button onClick={onClick} className={`base-button ${className}`}>
      {children}
    </button>
  );
}