import {Login, Logout} from './header.js';

await Login();
Logout();

const button = document.querySelector('.button-submit');

button.addEventListener('click', async function(event) {
    event.preventDefault();
    await ValidateUserUpdate();
});


async function GetUser() {
    let response = await fetch(`http://127.0.0.1:8000/users/${localStorage.getItem('user_id')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let result = await response.json();

    document.getElementById('username').value = result.username;
    
    if (result.is_landlord) {
        document.getElementById('is_landlord').checked = true;
    } else {
        document.getElementById('is_landlord').checked = false;
    }
}

await GetUser();


async function ValidateUserUpdate() {
    var username = document.getElementById('username').value.trim();
    var oldPassword = document.getElementById('old-password').value.trim();
    var newPassword = document.getElementById('new-password').value.trim();
    var isLandlordAgree = document.getElementById('is_landlord').checked;
    var isLandlord = false;
  
    let isValid = true;
  
    if (!username) {
      isValid = false;
      alert('Username field is required.');
    } else if (username.length > 50) {
      isValid = false;
      alert('Username field must be less than 50 characters.');
    }
  
    if (!oldPassword) {
      isValid = false;
      alert('Password field is required.');
    } else if (oldPassword.length > 50) {
      isValid = false;
      alert('Password field must be less than 50 characters.');
    }

    if (newPassword) {
        if (newPassword.length > 50) {
            isValid = false;
            alert('Password field must be less than 50 characters.');
        }
    } else {
        newPassword = oldPassword;
    }
  
    if (isLandlordAgree) {
      isLandlord = true;
    }
  
    if (isValid) {
      console.log(username);
      console.log(oldPassword);
      console.log(newPassword);
  
      let response = await fetch(`http://127.0.0.1:8000/users/update_user/${localStorage.getItem('user_id')}`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': `${username}`,
                                'old_password': `${oldPassword}`,
                                'new_password': `${newPassword}`,
                                'is_landlord': `${isLandlord}`})
        });
        let result = await response.json();
        alert(result.message);
  
      if(result.message=="User data updated") {
        window.location.replace('index.html');
      }
    }
  };
  