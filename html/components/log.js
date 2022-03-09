export const style = {
  '.log': {
    height: '100%',
    overflowY: 'auto',
    padding: '8px',
    fontFamily: 'monospace',

    '__message': {
      '_error': {
        color: '#f55'
      }
    }
  }
}

export function Log () {
  return mbr.dom('div', { className: 'log' }, function (log) {
    log.ifc = {
      push: function (message, level = 'LOG') {
        const shouldScroll = log.dom.scrollTop + log.dom.clientHeight >= log.dom.scrollHeight;
        const className = 'log__message' +
          (level === 'ERROR'
            ? ' log__message_error'
            : ''
          );

        log.append(mbr.dom('div', { className, innerText: message }));

        if (shouldScroll) {
          log.dom.scrollTop = log.dom.scrollHeight;
        }
      }
    }
  });
}
