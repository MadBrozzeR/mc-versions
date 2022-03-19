const MESSAGE_RE = /^(start|finish|log|error|update)\[(.+?)\](?::([\w\W]+))?$/;
let pendingMessage = null;
let ws;
const registry = {};

function connect(message) {
  pendingMessage = message;
  ws = new WebSocket('ws://' + window.location.host + '/ws');
  ws.onmessage = function (event) {
    const regMatch = MESSAGE_RE.exec(event.data);

    if (regMatch) {
      let [, command, id, text] = regMatch;

      id = id.split('|');

      if (id[0] in registry) {
        registry[id[0]](command, text, id[1]);

        if (command === 'finish') {
          delete registry[id[0]];
        }
      }
    }
  }

  ws.onopen = function () {
    if (pendingMessage) {
      ws.send(pendingMessage);
      pendingMessage = null;
    }
  }

  ws.onclose = function () {
    if (pendingMessage) {
      connect();
    }
  }
}

function send (message) {
  if (ws) {
    switch (ws.readyState) {
      case 0:
      case 2:
        pendingMessage = message;
        break;
      case 1:
        ws.send(message);
        break;
      case 3:
        connect(message);
        break;
    }
  } else {
    connect(message);
  }
}

export function setup ({ command, id, message, callback }) {
  send(command + '[' + id + ']' + (message ? (':' + message) : ''));
  registry[id] = callback;
}
