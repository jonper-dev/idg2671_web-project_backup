import React from "react";
import Button from "./Button";

export default function CreateStudyButton({ className = "", onClick }) {
  return (
    <Button onClick={onClick} className={`create-button ${className}`}>
      Create
    </Button>
  );
}