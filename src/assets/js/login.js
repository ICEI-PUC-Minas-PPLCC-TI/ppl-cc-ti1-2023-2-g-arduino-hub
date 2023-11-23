const apiURL = 'https://jsonserver--andreeluis.repl.co';
let usersList = [];

window.addEventListener('load', loadUsers, false);

if (window.location.pathname.includes('/login.html')) {
  document.querySelector('form.login').addEventListener('submit', login, false);
} else if (window.location.pathname.includes('/register.html')) {
  document.querySelector('form.register').addEventListener('submit', register, false);
}

async function loadUsers() {
  try { usersList = await (await fetch(`${apiURL}/users`)).json() }
  catch (error) { console.error('Falha ao carregar componentes:', error) }
}

function login(event) {
  event.preventDefault();

  loadUsers(); // Atualiza a lista de usuários

  let username = document.querySelector('#username').value;
  let password = document.querySelector('#password').value;

  try {
    let userFound = usersList.find(user => user.username === username && user.password === password);

    if (userFound) {
      sessionStorage.setItem('user', JSON.stringify({ "id":userFound.id, "name":userFound.name }));
      window.location = 'index.html';
    }
    else {
      alert('Usuário ou senha inválidos!');
    }
  }
  catch (error) { console.error('Usuário ou senha inválidos:', error); }
}

function register(event) {
  event.preventDefault();

  loadUsers(); // Atualiza a lista de usuários

  let name = document.querySelector('#name').value;
  let username = document.querySelector('#username').value;
  let email = document.querySelector('#email').value;
  let password = document.querySelector('#password').value;
  let passwordConfirmation = document.querySelector('#password-confirm').value;

  if (password.length < 6) {
    alert('A senha deve conter no mínimo 6 caracteres!');
    return;
  }
  if (password !== passwordConfirmation) {
    alert('As senhas não coincidem!');
    return;
  }
  if (/[A-Z]/.test(username)) {
    alert('O nome de usuário contém caracteres maiúsculos!');
    return;
  }
  if (username.length < 3) {
    alert('O nome de usuário deve conter no mínimo 3 caracteres!');
    return;
  }
  if (usersList.find(user => user.username === username) || usersList.find(user => user.email === email)) {
    alert('Nome de usuário ou e-mail já cadastrado!');
    return;
  }

  let newUser = {
    id: generateUUID(),
    name: name,
    username: username,
    email: email,
    password: password
  }

  try {
    fetch(`${apiURL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
      sessionStorage.setItem('user', JSON.stringify({ "id":data.id, "name":data.name }));
      window.location = 'index.html';
    })
  }
  catch (error) { console.error('Falha ao cadastrar usuário:', error) }
}
