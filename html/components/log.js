export const style = {
  '.log': {
    height: '100%',
    overflowY: 'auto',
    padding: '8px',
    fontFamily: 'monospace'
  }
}

export function Log () {
  return mbr.dom('div', { className: 'log' }, function (log) {
    log.ifc = {
      push: function (message) {
        const shouldScroll = log.dom.scrollTop + log.dom.clientHeight >= log.dom.scrollHeight;

        log.append(mbr.dom('div', { className: 'log__message', innerText: message }));

        if (shouldScroll) {
          log.dom.scrollTop = log.dom.scrollHeight;
        }
      }
    }
  });
}
