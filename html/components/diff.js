import { SoundDiff, PicDiff, TextDiff } from './diff/index.js';

export var style = {
  '.diff-block': {
    height: '100%'
  }
}

export function Diff () {
  return mbr.dom('div', { className: 'diff-block' }, function (diffBlock) {
    diffBlock.ifc = {
      set: function (params) {
        switch (params.type) {
          case 'text':
            diffBlock.clear().append(TextDiff(params));
            break;
          case 'picture':
            diffBlock.clear().append(PicDiff(params));
            break;
          case 'sound':
            diffBlock.clear().append(SoundDiff(params));
            break;
        }
      }
    }
  });
}
