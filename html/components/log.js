export const style = {
  '.log': {
    height: '100%',
    overflowY: 'auto',
    padding: '8px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-line',

    '__message': {
      '_error': {
        color: '#f55'
      }
    }
  }
}

export function Log () {
  return mbr.dom('div', { className: 'log' }, function (log) {
    const registry = {};

    log.ifc = {
      push: function (message, level = 'LOG') {
        const shouldScroll = log.dom.scrollTop + log.dom.clientHeight >= log.dom.scrollHeight;
        const className = 'log__message' +
          (level === 'ERROR'
            ? ' log__message_error'
            : ''
          );

        log.append(
          registry[message] = mbr.dom('div', { className, innerText: message })
        );

        if (shouldScroll) {
          log.dom.scrollTop = log.dom.scrollHeight;
        }
      },
      update: function (id, message) {
        registry[id] && (registry[id].dom.innerText = message);
      }
    }
  });
}
