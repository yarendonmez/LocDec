
import React from 'react';

const LocationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.242 1.953 1.953 0 00-.478-2.585l-.048-.05c-.244-.244-.64-.244-.884 0l-.047.05a1.294 1.294 0 01-1.83-.011L12.13 14.95a.75.75 0 01-1.06 0l-1.742-1.743a1.294 1.294 0 01-1.83.011l-.047-.05a.64.64 0 00-.884 0l-.048.05a1.953 1.953 0 00-.478 2.585 16.975 16.975 0 005.16 4.242z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M12 2.25a5.25 5.25 0 00-5.25 5.25c0 3.14 2.32 5.922 5.25 7.433 2.93-1.51 5.25-4.293 5.25-7.433A5.25 5.25 0 0012 2.25zM12 11.25a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default LocationIcon;
