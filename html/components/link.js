import { injectStyle } from "../styles/index.js";

injectStyle({
  '.link': {
    cursor: 'pointer',

    ':hover': {
      color: '#bbf'
    }
  }
});

export function Link ({ text, href, onClick }) {
  return mbr.dom('span', { className: 'link' }, function (link) {
    if (typeof text === 'string') {
      link.dom.innerText = text;
    } else {
      link.append(text);
    }

    link.dom.onclick = function (event) {
      if (href) {
        location.href = href;
      }

      if (onClick) {
        onClick.call(link, event);
      }
    }
  });
}
