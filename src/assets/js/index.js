const loginButton = document.querySelector('header nav .login');
const myAccountButton = document.querySelector('header nav .my-account');

window.addEventListener('load', loadContent, false);
document.querySelector('#logout').addEventListener('click', logout, false);

function isLogged() { return sessionStorage.getItem('userId') ? true : false; }

function loadContent() {
  console.log('isLogged:', isLogged());

  if (isLogged()) {
    loginButton.style.display = 'none';
    myAccountButton.style.display = 'block';
  }
  else {
    loginButton.style.display = 'block';
    myAccountButton.style.display = 'none';
  }
}

function logout(event) {
  event.preventDefault();

  sessionStorage.removeItem('userId');
  
  window.location.reload();
}
