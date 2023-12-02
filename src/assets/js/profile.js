let actualUser;
const editForm = document.querySelector('#profile-form');
const editPassword = document.querySelector('#change-password');
const deleteAccount = document.querySelector('#delete-account');

window.addEventListener('load', loadContent, false);
editForm.addEventListener('submit', editProfile, false);
editPassword.addEventListener('submit', changePassword, false);
deleteAccount.addEventListener('submit', deleteUser, false);


async function loadUser() {
  try { actualUser = await (await fetch(`${apiURL}/users/${user.id}`)).json()}
  catch (error) { console.error('Falha ao carregar usuário:', error)}
}


async function loadContent() {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  await loadUser();

  document.querySelector('#username').value = actualUser.username;
  document.querySelector('#email').value = actualUser.email;
}

async function editProfile(event) {
  event.preventDefault();

  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;

  if (username.length < 3) {
    alert('O nome de usuário deve conter no mínimo 3 caracteres!');
    return;
  }

  if (await usernameExists(username) && username !== actualUser.username) {
    alert('O nome de usuário já está em uso!');
    return;
  }

  if (await emailExists(email) && email !== actualUser.email) {
    alert('O email já está em uso!');
    return;
  }


  try {
    const response = await fetch(`${apiURL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    sessionStorage.setItem('user', JSON.stringify({ "id":user.id, "name":username }));

    window.location.href = 'index.html';
  }
  catch (error) {
    console.error('Falha ao editar o perfil:', error);
  }

}

async function changePassword(event) {
  event.preventDefault();

  const oldPassword = document.querySelector('#old-password').value;
  const newPassword = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#password-confirm').value;

  if (oldPassword !== actualUser.password) {
    alert('Senha atual incorreta!');
    return;
  }

  if (newPassword.length < 6) {
    alert('A senha deve conter no mínimo 6 caracteres!');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
    const response = await fetch(`${apiURL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    sessionStorage.removeItem('user');

    window.location.href = 'login.html';
  }
  catch (error) {
    console.error('Falha ao alterar a senha:', error);
  }
}


async function deleteUser(event) {
  event.preventDefault();

  const confirmDelete = window.confirm(`Você realmente quer excluir sua conta?`);
  if (user && confirmDelete) {
    try {
      const response = await fetch(`${apiURL}/users/${user.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      sessionStorage.removeItem('user');

      window.location.href = 'login.html';
    }
    catch (error) {
      console.error('Falha ao deletar o usuário:', error);
    }
  }
}
