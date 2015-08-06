document.querySelector('#signup').addEventListener('click', function(ev) {
  ev.preventDefault();
  var data = new FormData();
  var emailVal = document.querySelector('#email').value;
  data.append('email', emailVal);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup', true);
  xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
  };
  xhr.send(data);
});
