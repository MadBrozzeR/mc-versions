export const style = {
  '.compare': {
    height: '100%',

    '__wrapper': {
      width: '50%',
      height: '100%',
      overflow: 'auto',
      display: 'inline-block',
      flexWrap: 'wrap'
    },
    '__panel': {
      display: 'inline-block',
      minWidth: '100%',
      minHeight: '100%'
    }
  }
}

export function Compare(params, callback) {
  let leftWrapper, rightWrapper, left, right;

  return mbr.dom('div', null, function (block) {
    const compareCN = block.cn('compare');
    params.className && compareCN.add(params.className);

    block.append(
      leftWrapper = mbr.dom('div', { className: 'compare__wrapper' }, function (wrapper) {
        wrapper.dom.onscroll = function () {
          rightWrapper.dom.scrollTop = wrapper.dom.scrollTop;
          rightWrapper.dom.scrollLeft = wrapper.dom.scrollLeft;
        };
        wrapper.append(
          left = mbr.dom('div', { className: 'compare__panel' })
        );
      }),
      rightWrapper = mbr.dom('div', { className: 'compare__wrapper' }, function (wrapper) {
        wrapper.dom.onscroll = function () {
          leftWrapper.dom.scrollTop = wrapper.dom.scrollTop;
          leftWrapper.dom.scrollLeft = wrapper.dom.scrollLeft;
        };
        wrapper.append(
          right = mbr.dom('div', { className: 'compare__panel' })
        );
      })
    );

    callback.call(block, left, right);
  });
}
