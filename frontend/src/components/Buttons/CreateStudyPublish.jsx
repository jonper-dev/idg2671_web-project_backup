import React from "react";
import Button from "./Button";

export default function CreateStudyPublish({ className = "", onClick }) {
  return (
    <Button onClick={onClick} className={`publish-button ${className}`}>
      Create and Publish
    </Button>
  );
}