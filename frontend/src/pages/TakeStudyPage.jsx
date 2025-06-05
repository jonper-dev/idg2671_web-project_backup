import React from 'react';
import TakeStudy from '../components/TakeStudy/TakeStudy';
import './styles/pages.css';        // General styles
import './styles/TakeStudyPage.css' // TakeStudyPage specific styling.

const TakeStudyPage = () => {
  return (
    <div className="take-study-wrapper">
      <TakeStudy />
    </div>
  );
};

export default TakeStudyPage;
