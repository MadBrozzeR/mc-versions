export const keyframes = {
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },

  '@keyframes pop': {
    '0%': {
      transform: 'scale(1, 1)',
      opacity: 1
    },
    '50%': {
      transform: 'scale(0, 0)',
      opacity: 0
    },
    '80%': {
      transform: 'scale(0, 0)',
      opacity: 0
    },
    '100%': {
      transform: 'scale(1, 1)',
      opacity: 1
    }
  }
};
