// Utility functions to prevent layout shifts
export function getStableAspectRatio(width, height) {
  return (height / width) * 100;
}

export function createAspectRatioStyle(width, height) {
  return {
    position: 'relative',
    paddingBottom: `${getStableAspectRatio(width, height)}%`,
    overflow: 'hidden',
  };
}
