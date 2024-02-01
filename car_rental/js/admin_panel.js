async function GetStuffAbilities() {
    if (localStorage.getItem('stuff_id')) {
        let response = await fetch(`http://127.0.0.1:8000/stuff/info/${localStorage.getItem('stuff_id')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            } 
        });
        let dict = await response.json();
        let result = dict.data;

        var stuffAbilitiesList = document.querySelector('.stuff_abilities');
        stuffAbilitiesList.innerHTML = '';
        
        if(result.is_admin) {
            document.querySelector(".stuff_info").textContent = `Administrator: ${result.username}`;

            var ManagerControlItem = document.createElement('li');
            ManagerControlItem.setAttribute("id", "manager-control-li");
            var ManagerControlLink = document.createElement('a');
            ManagerControlLink.textContent = 'Manager control';
            ManagerControlItem.appendChild(ManagerControlLink);
            stuffAbilitiesList.appendChild(ManagerControlItem);
            GetExistingManagers()
            
        } else {
            document.querySelector(".stuff_info").textContent = `Manager: ${result.username}`;
        }

        var UserControlItem = document.createElement('li');
        var UserControlLink = document.createElement('a');
        UserControlLink.textContent = 'User control';
        UserControlItem.appendChild(UserControlLink);
        stuffAbilitiesList.appendChild(UserControlItem);

        var CarControlItem = document.createElement('li');
        var CarControlLink = document.createElement('a');
        CarControlLink.textContent = 'Car control';
        CarControlItem.appendChild(CarControlLink);
        stuffAbilitiesList.appendChild(CarControlItem);

        var RentControlItem = document.createElement('li');
        var RentControlLink = document.createElement('a');
        RentControlLink.textContent = 'Rent control';
        RentControlItem.appendChild(RentControlLink);
        stuffAbilitiesList.appendChild(RentControlItem);

        var ReviewControlItem = document.createElement('li');
        ReviewControlItem.setAttribute('id', 'review-control-li');
        var ReviewControlLink = document.createElement('a');
        ReviewControlLink.textContent = 'Review control';
        ReviewControlItem.appendChild(ReviewControlLink);
        stuffAbilitiesList.appendChild(ReviewControlItem);
        GetExistingReviews();

        var LogoutItem = document.createElement('li');
        LogoutItem.setAttribute("id", "logout-li");
        var LogoutLink = document.createElement('a');
        LogoutLink.href = 'stuff_login.html';
        LogoutLink.textContent = 'Logout';
        LogoutItem.appendChild(LogoutLink);
        stuffAbilitiesList.appendChild(LogoutItem);

    }
}


function StuffLogout() {
    var logoutLi = document.getElementById("logout-li");

    if(logoutLi) {
        logoutLi.addEventListener('click', function(event) {
            event.preventDefault();
    
            if (localStorage.getItem("stuff_id")) {
                localStorage.removeItem("stuff_id");
            }
        });
    }
}


async function createManager() {
    var usernameInput = document.getElementById('new_manager_username');
    var passwordInput = document.getElementById('new_manager_password');

    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();

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

    if(isValid) {
        let response = await fetch('http://127.0.0.1:8000/stuff/manager_registration', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username" : `${username}`,
                "password" : `${password}`,
            })
        });
        let result = await response.json();
        console.log(result);    
    }
    
    renderExistingManagers();
}


function generateCreateManagerForm() {
    var formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    var formHeader = document.createElement('h2');
    formHeader.classList.add('form-header');
    formHeader.textContent = 'Create Manager';

    var form = document.createElement('form');
    form.id = 'create_form';

    var usernameLabel = document.createElement('label');
    usernameLabel.classList.add('form-label');
    usernameLabel.textContent = 'Username:';

    var usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'new_manager_username';
    usernameInput.name = 'new_manager_username';
    usernameInput.classList.add('form-input');
    usernameInput.required = true;

    var passwordLabel = document.createElement('label');
    passwordLabel.classList.add('form-label');
    passwordLabel.textContent = 'Password:';

    var passwordInput = document.createElement('input');
    passwordInput.type = 'text';
    passwordInput.id = 'new_manager_password';
    passwordInput.name = 'new_manager_password';
    passwordInput.classList.add('form-input');
    passwordInput.required = true;

    var createButton = document.createElement('button');
    createButton.type = 'button';
    createButton.textContent = 'Create Manager';
    createButton.classList.add('form-button');
    createButton.addEventListener('click', createManager);

    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);

    formContainer.appendChild(formHeader);
    formContainer.appendChild(form);
    formContainer.appendChild(createButton);

    return formContainer;
}

async function renderExistingManagers() {
    var adminContent = document.querySelector('.admin-content');
    adminContent.innerHTML = '';

    var existingManagersList = document.createElement('ul');
    existingManagersList.classList.add('existing-list');

    var createManagerFormContainer = generateCreateManagerForm();
    existingManagersList.appendChild(createManagerFormContainer);

    let response = await fetch('http://127.0.0.1:8000/stuff/managers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let managers = dict.data;

    managers.forEach(manager => {
        var listItem = document.createElement('li');
        listItem.classList.add('list-item');

        var itemInfo = document.createElement('div');
        itemInfo.classList.add('item-info');

        var itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        var usernameSpan = document.createElement('span');
        usernameSpan.classList.add('manager-username');
        usernameSpan.textContent = `Username: ${manager.username}`;
        
        var passwordSpan = document.createElement('span');
        passwordSpan.classList.add('manager-password');
        passwordSpan.textContent = `Password: ${manager.password}`;

        var updateButton = document.createElement('button');
        updateButton.classList.add('update-button');
        updateButton.setAttribute('id', `update-button-${manager.id}`);
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateManager(manager.id));

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('id', `delete-button-${manager.id}`);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteManager(manager.id));

        itemInfo.appendChild(usernameSpan);
        itemInfo.appendChild(passwordSpan);
        itemButtons.appendChild(updateButton);
        itemButtons.appendChild(deleteButton);

        listItem.appendChild(itemInfo);
        listItem.appendChild(itemButtons);

        existingManagersList.appendChild(listItem);
    });

    adminContent.appendChild(existingManagersList);
}


function GetExistingManagers() {
    var managerControlLi = document.getElementById("manager-control-li");

    if(managerControlLi) {
        managerControlLi.addEventListener('click', function(event) {
            event.preventDefault();  
            renderExistingManagers();
        });
    }
}


async function updateManager(managerId) {
    let response = await fetch(`http://127.0.0.1:8000/stuff/${managerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let result = dict.data;

    var modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background');

    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalHeader = document.createElement('h2');
    modalHeader.textContent = 'Update Manager';

    var usernameInput = document.createElement('input');
    usernameInput.setAttribute('id', 'modal-username-input');
    usernameInput.type = 'text';
    usernameInput.value = result.username;

    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('id', 'modal-password-input');
    passwordInput.type = 'text';
    passwordInput.value = result.password;

    var okButton = document.createElement('button');
    okButton.classList.add('ok-button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', async function () {
        var modalManagerUsername = document.getElementById('modal-username-input').value.trim();
        var modalManagerPassword = document.getElementById('modal-password-input').value.trim();

        let isValid = true;

        if (!modalManagerUsername) {
            isValid = false;
            alert('Username field is required.');
        } else if (modalManagerUsername.length > 50) {
            isValid = false;
            alert('Username field must be less than 50 characters.');
        }

        if (!modalManagerPassword) {
            isValid = false;
            alert('Password field is required.');
        } else if (modalManagerPassword.length > 50) {
            isValid = false;
            alert('Password field must be less than 50 characters.');
        }

        if(isValid) {
            let response = await fetch(`http://127.0.0.1:8000/stuff/manager_update/${managerId}`, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username" : `${modalManagerUsername}`,
                    "password" : `${modalManagerPassword}`,
                })
            });
            let result = await response.json();
            console.log(result);    
        }
        closeModal();
        renderExistingManagers();
    });

    var cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeModal);

    modal.appendChild(modalHeader);
    modal.appendChild(usernameInput);
    modal.appendChild(passwordInput);
    modal.appendChild(okButton);
    modal.appendChild(cancelButton);

    modalBackground.appendChild(modal);

    document.body.appendChild(modalBackground);

}


function closeModal() {
    var modalBackground = document.querySelector('.modal-background');
    modalBackground.remove();
}


async function deleteManager(managerId) {
    var confirmDelete = window.confirm("Are you sure you want to delete manager?");
    
    if(confirmDelete) {
        await fetch(`http://127.0.0.1:8000/stuff/manager_delete/${managerId}`, {
        method: 'DELETE',
        });

        renderExistingManagers();
    } else {
        console.log("Passed");
    }
}


function GetExistingReviews() {
    var reviewControlLi = document.getElementById("review-control-li");

    if(reviewControlLi) {
        reviewControlLi.addEventListener('click', function(event) {
            event.preventDefault();  
            // renderExistingManagers();
        });
    }
}


function InitFunctions() {
    GetStuffAbilities();
    StuffLogout();
}

InitFunctions();
