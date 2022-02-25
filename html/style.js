var style = {
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
  },

  '*': {
    boxSizing: 'border-box'
  },
  'html': {
    height: '100%'
  },
  'body': {
    backgroundColor: '#022',
    color: '#eee',
    margin: 0,
    height: '100%'
  },
  '.waiter': {
    width: '64px',
    height: '64px',
    animation: 'rotate 1s linear infinite',

    '__wrapper': {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    ':before': {
      display: 'block',
      content: '""',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      width: '10px',
      height: '10px',
      margin: '0 auto',
      marginBottom: '44px',
      animation: 'pop .5s linear infinite'
    },

    ':after': {
      display: 'block',
      content: '""',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      width: '10px',
      height: '10px',
      margin: '0 auto',
      animation: 'pop .5s linear .25s infinite'
    }
  },
  '.modal': {
    width: '200px',
    height:0,
    backgroundColor: '#002',
    border: '1px solid #ddd',
    paddingTop: '24px',
    transition: [
      '.2s width ease-in-out',
      '.2s height ease-in-out',
      '.2s transform ease-in-out'
    ].join(','),
    transform: 'translateY(-200px)',
    overflow: 'hidden',

    '__curtain': {
      opacity: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: '100%',
      right: 0,
      backgroundColor: 'rgba(10, 0, 0, .8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: [
        '.3s opacity ease-in-out',
        '.3s bottom step-end'
      ].join(','),

      '.active': {
        opacity: 1,
        bottom: 0,
        transition: [
          '.3s bottom step-start',
          '.3s opacity ease-in-out'
        ].join(','),

        '.size_s .modal': {
          width: '200px',
          height: '160px'
        },

        '.size_l .modal': {
          width: '1000px',
          height: '600px'
        },

        ' .modal': {
          transform: 'translateY(0)',
        }
      }
    },

    '__head': {
      height: '24px',
      lineHeight: '24px',
      fontSize: '20px',
      padding: '0 24px 0 8px',
      marginTop: '-24px'
    },

    '__title': {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%',
    },

    '__close': {
      display: 'inline-block',
      position: 'absolute',
      lineHeight: '24px',
      width: '24px',
      textAlign: 'center',
      top: 0,
      right: 0,
      cursor: 'pointer'
    },

    '__content': {
      height: '100%',

      ':before': {
        display: 'block',
        content: '""',
        width: '98%',
        height: '1px',
        backgroundColor: '#c99',
        margin: '0 auto'
      }
    }
  },
  '.mainblock': {
    height: '100%',
    paddingTop: '60px'
  },
  '.toolbar': {
    marginTop: '-24px',
    height: '24px',

    '-button': {
      height: '100%',
      border: '1px solid #ddd',
      borderRadius: '3px',
      backgroundColor: '#777'
    }
  },
  '.version': {
    margin: '4px 0',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    width: '100%',

    '-list': {
      height: '50%',
      overflowY: 'auto',
      width: '40%'
    },

    '-download': {
      opacity: .4,
      display: 'inline-block',
      marginRight: '8px',
      cursor: 'default',

      '.active': {
        opacity: 1,
        cursor: 'pointer'
      }
    },

    '-flag': {
      cursor: 'pointer',
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '1px solid #ddd',
      borderRadius: '3px',
      marginRight: '8px',
      verticalAlign: 'middle',

      '.first': {
        backgroundColor: '#0e0'
      },
      '.second': {
        backgroundColor: '#00e'
      }
    }
  },
  '.diff-list': {
    height: '50%',
    width: '40%',
    overflowY: 'auto'
  },
  '.diff-group': {
    ' .diff-group__head': {
      padding: '4px',
      fontSize: '24px',
      cursor: 'pointer'
    },
    ' .diff-group__title': {
      display: 'inline-block',
      marginLeft: '8px'
    },
    ' .diff-group__arrow': {
      display: 'inline-block',
      transition: '.2s transform ease-in-out'
    },
    ' .diff-group__list': {
      display: 'none',
      paddingLeft: '24px'
    },

    '.active': {
      ' .diff-group__arrow': {
        transform: 'rotate3d(1, 0, 0, 180deg)'
      },
      ' .diff-group__list': {
        display: 'block'
      },
    }
  }
}
