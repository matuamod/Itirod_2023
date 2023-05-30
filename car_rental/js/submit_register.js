import {Login, Logout} from './header.js';

await Login();
Logout();

const button = document.querySelector('.button-submit');

button.addEventListener('click', async function(event) {
    event.preventDefault();
    await ValidateRegistration();
});


function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}


function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}


async function ValidateRegistration() {

  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var email = document.getElementById('email').value.trim();
  var telephone = document.getElementById('telephone').value.trim();
  var dateOfBirth = new Date(document.getElementById('date_of_birth').value);
  var isLandlordAgree = document.getElementById('is_landlord').checked;
  var isLandlord = false;
  var agree = document.getElementById('agree').checked;

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

  if (!email) {
    isValid = false;
    alert('Email field is required.');
  } else if (email.length > 100) {
    isValid = false;
    alert('Email field must be less than 100 characters.');
  } else if (!email.includes('@') || !email.includes('.com')) {
    isValid = false;
    alert('Email field must include "@" and ".com".');
  }

  if (!telephone) {
    isValid = false;
    alert('Telephone field is required.');
  } else if (!telephone.startsWith('+')) {
    isValid = false;
    alert('Telephone field must start with "+" symbol.');
  } else if (isNaN(telephone.slice(1))) {
    isValid = false;
    alert('Telephone field must include only digits.');
  }

  if (!dateOfBirth) {
    isValid = false;
    alert('Invalid date of birth.');
  } else {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 18);
    if (dateOfBirth > cutoffDate) {
      isValid = false;
      alert('You must be at least 18 years old to register.');
    }
  }

  if (isLandlordAgree) {
    isLandlord = true;
  }

  if (!agree) {
    isValid = false;
    alert('Agree checkbox must must be checked.');
  }

  if (isValid) {
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(telephone);
    console.log(formatDate(dateOfBirth));

    let response = await fetch('http://127.0.0.1:8000/users/registration', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username': `${username}`,
          'password': `${password}`, 
          'email': `${email}`,
          'telephone': `${telephone}`,
          'date_of_birth': `${formatDate(dateOfBirth)}`,
          'is_landlord': `${isLandlord}`,
        })
    });
    let result = await response.json();
    alert(result.message)

    if(result.message=="User succesfully created") {
      console.log(result.id)
      // localStorage.setItem("user_id", result.id)
      Login(result.id, result.username);
      window.location.replace('index.html');
    }
  }
};
