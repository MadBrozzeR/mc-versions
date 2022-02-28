import { DiffList } from './diff-list.js';
import { Diff } from './diff.js';
import { get, fetcher } from '../fetchers.js';
import { selectedVersions } from '../store.js';

const DIFF_TOOLBAR_HEIGHT = '30px';
const DIFF_TOOLBAR_BG = '#033';

export const style = {
  '.diff-pane': {
    height: '100%',
    paddingTop: DIFF_TOOLBAR_HEIGHT,
    display: 'block',

    '__diff-list': {
      marginTop: '-' + DIFF_TOOLBAR_HEIGHT,
      height: DIFF_TOOLBAR_HEIGHT,
      overflow: 'visible',
      backgroundColor: DIFF_TOOLBAR_BG,
      position: 'relative',
      borderTop: '1px solid #eee',
      padding: '0 16px',

      ':hover .diff-pane__diff-list-wrapper': {
        height: '200px',
        transitionDelay: '0s'
      }
    },

    '__diff-list-title': {
      lineHeight: DIFF_TOOLBAR_HEIGHT,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    '__diff-list-wrapper': {
      position: 'absolute',
      top: '100%',
      left: 0,
      height: 0,
      width: '100%',
      padding: '0 0 0 16px',
      borderBottom: '1px solid #eee',
      overflow: 'hidden',
      transition: '.2s height ease-in-out .5s',
      backgroundColor: DIFF_TOOLBAR_BG,
      zIndex: 1,
    }
  }
};

export function DiffPane() {
  var list, diff, title;

  function onSelect(file) {
    setTitle(file);

    fetcher(
      get.diff({
        first: selectedVersions.first.get(),
        second: selectedVersions.second.get(),
        file: file.name
      }),
      (result) => {
        diff.ifc.set(result);
      }
    );
  }

  fetcher(
    get.diff({
      first: selectedVersions.first.get(),
      second: selectedVersions.second.get()
    }),
    (response) => {
      list.ifc.set(response)
    }
  );

  function setTitle (file) {
    title.dom.innerText = 
      selectedVersions.first.get() + ' .. ' +
      selectedVersions.second.get() + (
        file ? (' > ' + file.name) : ''
      )
  }

  return mbr.dom('dom', { className: 'diff-pane' }, function (pane) {
    pane.append(
      mbr.dom('div', {className: 'diff-pane__diff-list'}, function (listBlock) {
        listBlock.append(
          title = mbr.dom('div', {className: 'diff-pane__diff-list-title' }),
          mbr.dom('div', { className: 'diff-pane__diff-list-wrapper' }, function (wrapper) {
            wrapper.append(
              list = DiffList({ onSelect })
            );
          })
        );
        setTitle();
      }),
      diff = Diff()
    );
  });
}
