import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"></path>
    <path d="M5 3l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"></path>
    <path d="M19 19l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"></path>
  </svg>
);

export default SparklesIcon;