export const style = {
  '.player-button': {
    marginRight: '8px',
    verticalAlign: 'middle',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    borderStyle: 'solid',
    borderColor: 'transparent white',
    transition: [
      '.2s border-width ease-in-out',
      '.2s border-radius ease-in-out'
    ].join(','),

    '_IDLE': {
      borderWidth: '10px 0 10px 20px',
    },
    '_LOADING': {
      borderWidth: '3px',
      borderRadius: '50%',
      animation: '.7s rotate linear infinite'
    },
    '_PLAYING': {
      borderWidth: '0 7px'
    }
  }
};

const audio = new Audio();
const STATE = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING'
}
 
const current = {
  cn: null,
  state: STATE.IDLE,
  set: function (state, cn) {
    if ((!cn || this.cn === cn) && state !== this.state) {
      this.setState(state);
    } else if (this.cn !== cn) {
      this.setState(STATE.IDLE);
      this.cn = cn;
      this.setState(state);
    }
  },
  setState: function (state) {
    if (this.cn) {
      this.cn.del('player-button_' + this.state);
      this.cn.add('player-button_' + state);
    }
    this.state = state;
  }
};

audio.autoplay = true;
audio.oncanplaythrough = function () {
  current.set(STATE.PLAYING);
  audio.play()
}
audio.onended = function () {
  current.set(STATE.IDLE);
}

export function Play (src) {
  return mbr.dom('span', null, function (button) {
    const buttonCN = button.cn('player-button player-button_' + STATE.IDLE);

    button.dom.onclick = function () {
      if (current.cn === buttonCN) {
        switch (current.state) {
          case STATE.IDLE:
            current.set(STATE.PLAYING, buttonCN);
            audio.play();
            break;
          case STATE.PLAYING:
            current.set(STATE.IDLE, buttonCN);
            audio.pause();
            break;
        }
      } else {
        audio.src = src;
        current.set(STATE.LOADING, buttonCN);
      }
    }
  });
}
