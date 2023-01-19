//ChildComponent.js

import React from 'react';
import GrandChildComponent from './GrandChildComponent';

const ChildComponent = () => {
  return (
    <>
      <h1> Child component </h1>
      <GrandChildComponent />
    </>
  );
};

export default ChildComponent;