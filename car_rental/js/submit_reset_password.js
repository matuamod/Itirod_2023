const button = document.querySelector('.button-submit');

button.addEventListener('click', async function(event) {
    event.preventDefault();
    await CheckUserResetPassword();
});


async function CheckUserResetPassword() {

  var username = document.getElementById('username').value.trim();
  var email = document.getElementById('email').value.trim();

  console.log(username);
  console.log(email);

  let isValid = true;

  if (!username) {
    isValid = false;
    alert('Username field is required.');
  } else if (username.length > 50) {
    isValid = false;
    alert('Username field must be less than 50 characters.');
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

  if(isValid) {
    let response = await fetch('http://127.0.0.1:8000/users/set_reset_password', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username': `${username}`, 
          'email': `${email}`
        })
    });
    let result = await response.json();
    alert(result.message);
    if(result.message=="Reset data succesfully created. Check your email with new password after a few minutes") {
        window.location.replace('login.html');
    }
  }
}