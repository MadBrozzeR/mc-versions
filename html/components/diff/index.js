import { SoundDiff, style as soundDiffStyle } from './sound-diff.js';
import { PicDiff, style as picDiffStyle } from './pic-diff.js';
import { TextDiff, style as textDiffStyle } from './text-diff.js';
import { style as compareStyle } from './compare.js';

export const style = {
  ...soundDiffStyle,
  ...compareStyle,
  ...picDiffStyle,
  ...textDiffStyle,
};

export { SoundDiff, PicDiff, TextDiff };
