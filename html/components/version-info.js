import { get, fetcher } from '../fetchers.js';
import { injectStyle } from '../styles/index.js';
import { Link } from './link.js';
import { Tree } from './tree.js';

injectStyle({
  '.version-info': {
    '__title': {
      height: '30px',
      border: '1px solid #eee',
      borderWidth: '1px 0',
      backgroundColor: '#033',
      padding: '0 16px',
      lineHeight: '28px'
    },
    '__line': {
      padding: '4px 20px',

      '-label': {
        display: 'inline-block',
        width: '160px'
      },

      '-value': {
        display: 'inline-block',
      }
    }
  }
});

function InfoLine({ label, value }) {
  return mbr.dom('div', { className: 'version-info__line' }, function (line) {
    line.append(
      mbr.dom('span', { className: 'version-info__line-label', innerText: label }),
      mbr.dom('span', { className: 'version-info__line-value' }, function (valueBlock) {
        if (typeof value === 'string') {
          valueBlock.dom.innerText = value;
        } else {
          valueBlock.append(value);
        }
      })
    );
  });
}

function zeroLead (value) {
  return (value < 10 ? '0' : '') + value;
}

function getTimestamp(time) {
  const date = new Date(time);

  return [
    zeroLead(date.getDate()),
    zeroLead(date.getMonth() + 1),
    date.getFullYear()
  ].join('.') + ' ' + [
    zeroLead(date.getHours()),
    zeroLead(date.getMinutes()),
    zeroLead(date.getSeconds())
  ].join(':');
}

function InfoBlock (version) {
  return mbr.dom('div', null, function (info) {
    info.append(
      InfoLine({
        label: 'Release Time',
        value: getTimestamp(version.releaseTime)
      }),
      InfoLine({
        label: 'Client',
        value: Link({ text: 'Download', href: version.downloads.client.url })
      }),
      InfoLine({
        label: 'Server',
        value: Link({ text: 'Download', href: version.downloads.server.url })
      })
    );
  });
}

function InfoTree (version) {
  return mbr.dom('div', null, function (block) {
    fetcher(
      get.tree({ version: version.id }),
      result => {
        const tree = Tree({});
        block.append(tree);
        result.forEach(file => tree.ifc.push(file.name));
      }
    )
  });
}

export function VersionInfo (version) {
  return mbr.dom('div', { className: 'version-info' }, function (infoBlock) {
    fetcher(
      get.version({ version: version.id, fromFile: version.fromFile }),
      response => {
        infoBlock.clear().append(
          mbr.dom('div', {
            className: 'version-info__title',
            innerText: response.id + ' (' + response.type + ')'
          }),
          InfoBlock(response),
          InfoTree(response)
        );
        // infoBlock.dom.innerText += JSON.stringify(response, null, 2)
      }
    )
  });
}
