
import React from 'react';
import RingLoader from '.';

const RingLoaderWithWrapper = ({ ...props }) => {
  return <div className='RingLoaderWithWrapper' {...props}>
    <RingLoader />
  </div>;
};

export default RingLoaderWithWrapper;
