import React from 'react';
import Styles from 'styles/loader.css';

export default function Loader({className, color, style, loaderStep}) {
  let animation, step;
  if (typeof loaderStep === 'number') {
    step = loaderStep;
    if (loaderStep === 4) {
      animation = Styles.animate;
    };
  } else {
    animation = Styles.animate;
    step = 4;
  };
  return <div
    className={[Styles.loader, animation, className].join(' ')} 
    style={{
      ...style,
      borderTopColor: (step > 0) ? color : 'transparent',
      borderRightColor: (step > 1) ? color : 'transparent',
      borderBottomColor: (step > 2) ? color : 'transparent'
    }} 
  />
};