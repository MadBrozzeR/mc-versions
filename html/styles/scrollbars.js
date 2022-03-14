export const scrollbars = {
  '::-webkit-scrollbar': {
    width: '6px',
    height: '6px',

    '-track': {
      backgroundColor: '#011',
      borderRadius: '3px',
    },

    '-thumb': {
      backgroundColor: '#555',
      borderRadius: '3px',
      transition: '.2s background-color ease-in-out',

      ':hover': {
        backgroundColor: '#999'
      }
    },

    '-corner': {
      backgroundColor: '#334',
      borderRadius: '0 0 100% 0',
    }
  }
};
