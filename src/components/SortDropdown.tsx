import React, { useState, useRef, useEffect } from 'react';

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  isLightMode?: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ options, value, onChange, isLightMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        width: '100px',
        zIndex: 1000
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.35em 0.6em',
          backgroundColor: isLightMode ? 'rgba(230, 143, 172, 0.1)' : 'rgba(255, 255, 255, 0.08)',
          border: `1px solid ${isLightMode ? 'rgba(230, 143, 172, 0.3)' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '20px',
          color: isLightMode ? '#2C1810' : '#fff',
          fontSize: '0.75rem',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.backgroundColor = isLightMode 
            ? 'rgba(230, 143, 172, 0.15)' 
            : 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.borderColor = isLightMode 
            ? 'rgba(230, 143, 172, 0.4)' 
            : 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.backgroundColor = isLightMode 
            ? 'rgba(230, 143, 172, 0.1)' 
            : 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = isLightMode 
            ? 'rgba(230, 143, 172, 0.3)' 
            : 'rgba(255, 255, 255, 0.15)';
        }}
      >
        <span>{selectedOption?.label}</span>
        <span style={{
          marginLeft: '3px',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s ease',
          fontSize: '0.6rem',
          opacity: 0.8,
          color: isLightMode ? '#E68FAC' : 'inherit'
        }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90px',
            backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 26, 26, 0.95)',
            borderRadius: '10px',
            border: `1px solid ${isLightMode ? 'rgba(230, 143, 172, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
            overflow: 'hidden',
            boxShadow: isLightMode 
              ? '0 4px 12px rgba(230, 143, 172, 0.15)' 
              : '0 4px 12px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            animation: 'dropdownSlideDown 0.2s ease-out',
            zIndex: 1001
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                padding: '0.35em 0.6em',
                color: isLightMode 
                  ? (option.value === value ? '#E68FAC' : '#2C1810')
                  : (option.value === value ? '#FFB6C1' : '#fff'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.75rem',
                fontWeight: option.value === value ? '500' : '400',
                backgroundColor: option.value === value 
                  ? (isLightMode ? 'rgba(230, 143, 172, 0.1)' : 'rgba(255, 182, 193, 0.1)')
                  : 'transparent',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = option.value === value 
                  ? (isLightMode ? 'rgba(230, 143, 172, 0.15)' : 'rgba(255, 182, 193, 0.15)')
                  : (isLightMode ? 'rgba(230, 143, 172, 0.1)' : 'rgba(255, 255, 255, 0.1)');
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = option.value === value 
                  ? (isLightMode ? 'rgba(230, 143, 172, 0.1)' : 'rgba(255, 182, 193, 0.1)')
                  : 'transparent';
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes dropdownSlideDown {
            from {
              opacity: 0;
              transform: translate(-50%, -8px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SortDropdown; 