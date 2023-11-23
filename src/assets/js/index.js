const loginButton = document.querySelector('header nav .login');
const myAccountButton = document.querySelector('header nav .my-account');

window.addEventListener('load', loadContent, false);
document.querySelector('#logout').addEventListener('click', logout, false);

function isLogged() { return sessionStorage.getItem('user') ? true : false; }

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

  sessionStorage.removeItem('user');
  location.reload();
}

function generateUUID(qtde) {
  uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  if (qtde) { return uuid.slice(0, qtde) }
  else { return uuid }
}
