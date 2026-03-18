import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const StoreIcon: React.FC<IconProps> = (props) => (
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
    <path d="M18 6L18 4H6L6 6"></path>
    <path d="M2 6H22"></path>
    <path d="M19 6V20H5V6"></path>
    <path d="M12 11V16"></path>
    <path d="M9 11V16"></path>
    <path d="M15 11V16"></path>
  </svg>
);

export default StoreIcon;