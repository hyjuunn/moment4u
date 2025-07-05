import React from 'react';
import '../styles/global.css';

const CreateDiaryPage: React.FC = () => {
  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        padding: '2rem',
      }}>
        {/* Content will be added here */}
      </div>
    </div>
  );
};

export default CreateDiaryPage; 