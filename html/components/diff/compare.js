export const style = {
  '.compare': {
    '__panel': {
      width: '50%',
      height: '100%',
      overflow: 'auto',
      display: 'inline-block',
      flexWrap: 'wrap'
    }
  }
}

export function Compare(params, callback) {
  let left, right;

  return mbr.dom('div', null, function (block) {
    const compareCN = block.cn('compare');
    params.className && compareCN.add(params.className);

    block.append(
      left = mbr.dom('div', { className: 'compare__panel' }, function (wrapper) {
        wrapper.dom.onscroll = function () {
          right.dom.scrollTop = wrapper.dom.scrollTop;
          right.dom.scrollLeft = wrapper.dom.scrollLeft;
        };
      }),
      right = mbr.dom('div', { className: 'compare__panel' }, function (wrapper) {
        wrapper.dom.onscroll = function () {
          left.dom.scrollTop = wrapper.dom.scrollTop;
          left.dom.scrollLeft = wrapper.dom.scrollLeft;
        };
      })
    );

    callback.call(block, left, right);
  });
}
