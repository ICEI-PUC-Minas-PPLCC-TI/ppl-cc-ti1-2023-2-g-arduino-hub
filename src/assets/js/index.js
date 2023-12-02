const apiURL = 'https://arduinohub--andreeluis.repl.co';
const user = JSON.parse(sessionStorage.getItem('user'));

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

function usernameExists(username) {
  return fetch(`${apiURL}/users?username=${username}`)
    .then(response => response.json())
    .then(data => data.length > 0 ? true : false)
    .catch(error => console.error('Falha ao verificar se o usuário existe:', error));
}

function emailExists(email) {
  return fetch(`${apiURL}/users?email=${email}`)
    .then(response => response.json())
    .then(data => data.length > 0 ? true : false)
    .catch(error => console.error('Falha ao verificar se o email existe:', error));
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
