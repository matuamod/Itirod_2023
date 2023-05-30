import {Login, Logout} from './header.js';

await Login();
Logout();

const button = document.querySelector('.button-submit');

button.addEventListener('click', async function(event) {
    event.preventDefault();
    await CheckLogin();
});


async function CheckLogin() {

  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var agree = document.getElementById('agree').checked;

  console.log(username);
  console.log(password);

  let isValid = true;

  if (!username) {
    isValid = false;
    alert('Username field is required.');
  } else if (username.length > 50) {
    isValid = false;
    alert('Username field must be less than 50 characters.');
  }

  if (!password) {
    isValid = false;
    alert('Password field is required.');
  } else if (password.length > 50) {
    isValid = false;
    alert('Password field must be less than 50 characters.');
  }

  if (!agree) {
    isValid = false;
    alert('Agree checkbox must must be checked.');
  }

  let response = await fetch('http://127.0.0.1:8000/users/login', {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': `${username}`, 
        'password': `${password}`
      })
  });
  let result = await response.json();

  if(result.message=="Successful login") {
      console.log(result.id);
      localStorage.setItem("user_id", result.id); 
      alert("Login Confirmed");
      window.location.replace('index.html');
  } else {
      alert("Wrong username or password")
  }
};