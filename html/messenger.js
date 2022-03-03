let ws = new WebSocket('ws://' + window.location.host + '/ws');

const registry = {};

const MESSAGE_RE = /^(start|finish|log|error)\[(.+?)\](?::([\w\W]+))?$/;

ws.onmessage = function (event) {
  const regMatch = MESSAGE_RE.exec(event.data);

  if (regMatch) {
    const [, command, id, text] = regMatch;

    if (id in registry) {
      registry[id](command, text);

      if (command === 'finish') {
        delete registry[id];
      }
    }
  }
}

export function setup ({ command, id, message, callback }) {
  ws.send(command + '[' + id + ']' + (message ? (':' + message) : ''));
  registry[id] = callback;
}
