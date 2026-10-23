import React, { useEffect } from 'react';
import { initStarfield } from '../../utils/starsCanvas';

export const StarfieldCanvas: React.FC = () => {
  useEffect(() => {
    const cleanup = initStarfield('starfield-canvas');
    return cleanup;
  }, []);

  return <canvas id="starfield-canvas" aria-hidden="true" />;
};
