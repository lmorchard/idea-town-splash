var isEmail = require('isemail');

var submitBtnEl  = document.querySelector('#signup');
var errorMsgEl   = document.querySelector('.server-error');
var invalidMsgEl = document.querySelector('.invalid-email');
var successMsgEl = document.querySelector('.email-submitted');
var emailEl = document.querySelector('#signupForm input#email');

submitBtnEl.addEventListener('click', function(ev) {
  ev.preventDefault();
  var emailVal = emailEl.value;

  if (!validateEmail(emailVal)) {
    emailEl.onkeyup = emailEl.onkeydown = emailEl.onkeypress = onInputChange;
  } else {
    emailEl.onkeyup = emailEl.onkeydown = emailEl.onkeypress = null;
    makeRequest(emailVal);
  }
});

function makeRequest(emailValue) {
  var data = new FormData();
  data.append('email', emailValue);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup', true);
  xhr.onload = onSubmitLoad;
  xhr.send(data);
}

function onInputChange(ev) {
  validateEmail(ev.target.value);
}

function validateEmail(value) {
  if (isEmail(value)) {
    invalidMsgEl.classList.add('hidden');
    return true;
  } else {
    invalidMsgEl.classList.remove('hidden');
    return false;
  }
}

function onSubmitLoad(ev) {
  if (ev.target.status === 500) {
    errorMsgEl.classList.remove('hidden');
  } else {
    successMsgEl.classList.remove('hidden');
    submitBtnEl.disabled = true;
  }
}
