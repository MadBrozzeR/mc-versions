window.onload = function () {
  var get = {
    versions: function () {
      return fetch('/act/versions');
    }
  }

  function waiter (request, onSuccess) {
    return request
      .then(function (response) { return response.json() })
      .then(onSuccess);
  }

  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  mbr.stylesheet(style, head);

  mbr.dom('div', null. function (mainblock) {
    waiter(get.versions(), function (response) {
      
    });
  })
}
