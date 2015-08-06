var isEmail = require('isemail');

var signupForm = document.querySelector('#signup-form');
var submitBtnEl  = document.querySelector('#signup');
var errorMsgEl   = document.querySelector('.server-error');
var invalidMsgEl = document.querySelector('.invalid-email');
var successMsgEl = document.querySelector('.email-submitted');
var emailEl = document.querySelector('#signup-form input#email');

var SLOW = 1000;
var FAST = 150;

emailEl.addEventListener('keyup', function(ev) {

  var emailVal = emailEl.value;
  var isValid = validateEmail(emailVal);

  if(ev.charCode !== 13) {
    clearMessage(invalidMsgEl);
    clearMessage(errorMsgEl);
  }

  if(emailEl.classList.contains('error')) {
    emailEl.classList.remove('error');
  }

  setSubmitButtonState(isValid);
});

signupForm.addEventListener('submit', function(ev) {
  ev.preventDefault();

  var emailVal = emailEl.value;
  var isValid = validateEmail(emailVal);

  if (isValid) {
    makeRequest(emailVal);
  } else {
    showMessage(invalidMsgEl);
    emailEl.focus();
    emailEl.classList.add('error');
  }

});

function validateEmail(value) {
  return isEmail(value);
}

function setSubmitButtonState(isValid) {
  if (isValid) {
    submitBtnEl.classList.remove('disabled');
  } else {
    submitBtnEl.classList.add('disabled');
  }
}

function showMessage(msgEl) {
  if (msgEl.classList.contains('hidden')) {
    msgEl.classList.remove('hidden');
    addThenRemoveAnimationClass(msgEl, 'fade-in-pop-in', FAST, 'in');
  } else {
    addThenRemoveAnimationClass(msgEl, 'shake', SLOW, 'in');
  }
}

function clearMessage(msgEl) {
  if (!msgEl.classList.contains('hidden')) {
    addThenRemoveAnimationClass(msgEl, 'fade-out', FAST, 'out');
  }
}

function addThenRemoveAnimationClass(msgEl, className, timing, direction) {
  msgEl.classList.add(className);
  clearTimeout();
  setTimeout(function() {
    if (direction === 'out') {
      msgEl.classList.add('hidden');
    }
    msgEl.classList.remove(className);
  }, timing);
}

function makeRequest(emailValue) {
  var data = new FormData();
  data.append('email', emailValue);
  submitBtnEl.disabled = true;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup', true);
  xhr.onload = onSubmitLoad;
  xhr.send(data);
}

function onSubmitLoad(ev) {
  if (ev.target.status === 500) {
    showMessage(errorMsgEl);
    submitBtnEl.disabled = false;
  } else {
    signupForm.classList.add('fade-out');
    successMsgEl.classList.add('move-to-zero');
  }
}
