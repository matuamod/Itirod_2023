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
            GetExistingManagers();
            
        } else {
            document.querySelector(".stuff_info").textContent = `Manager: ${result.username}`;
        }

        var UserControlItem = document.createElement('li');
        UserControlItem.setAttribute("id", "user-control-li");
        var UserControlLink = document.createElement('a');
        UserControlLink.textContent = 'User control';
        UserControlItem.appendChild(UserControlLink);
        stuffAbilitiesList.appendChild(UserControlItem);
        GetExistingUsers();

        var CarControlItem = document.createElement('li');
        CarControlItem.setAttribute("id", "car-control-li");
        var CarControlLink = document.createElement('a');
        CarControlLink.textContent = 'Car control';
        CarControlItem.appendChild(CarControlLink);
        stuffAbilitiesList.appendChild(CarControlItem);
        GetExistingCars();

        var RentControlItem = document.createElement('li');
        RentControlItem.setAttribute("id", "rent-control-li");
        var RentControlLink = document.createElement('a');
        RentControlLink.textContent = 'Rent control';
        RentControlItem.appendChild(RentControlLink);
        stuffAbilitiesList.appendChild(RentControlItem);
        GetExistingRents();

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
        itemInfo.classList.add('large-item-info');

        var itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        var managerUsername = document.createElement('div');
        managerUsername.classList.add('manager-name');
        
        var usernameSpan = document.createElement('span');
        usernameSpan.classList.add('manager-username');
        usernameSpan.textContent = `Username: ${manager.username}`;

        managerUsername.appendChild(usernameSpan);

        var managerPassword = document.createElement('div');
        managerPassword.classList.add('manager-entrycode');
        managerPassword.classList.add('sub-info');
        
        var passwordSpan = document.createElement('span');
        passwordSpan.classList.add('manager-password');
        passwordSpan.textContent = `Password: ${manager.password}`;

        managerPassword.appendChild(passwordSpan);

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

        itemInfo.appendChild(managerUsername);
        itemInfo.appendChild(managerPassword);
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


async function renderExistingUsers() {
    var adminContent = document.querySelector('.admin-content');
    adminContent.innerHTML = '';

    var existingUsersList = document.createElement('ul');
    existingUsersList.classList.add('existing-list');

    let response = await fetch('http://127.0.0.1:8000/users/get_users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let users = dict.data;
    console.log(users);

    var createItem = document.createElement('li');
    createItem.classList.add('list-item');

    var createItemButton = document.createElement('div');
    createItemButton.classList.add('create-item-button');

    var createButton = document.createElement('button');
    createButton.classList.add('form-button');
    createButton.classList.add('create-button');
    createButton.setAttribute('id', `create-button`);
    createButton.textContent = 'Create User';
    createButton.addEventListener('click', () => createUser());

    createItemButton.appendChild(createButton);
    createItem.appendChild(createItemButton);
    existingUsersList.appendChild(createItem);

    users.forEach(user => {
        var listItem = document.createElement('li');
        listItem.classList.add('list-item');

        var itemInfo = document.createElement('div');
        itemInfo.classList.add('large-item-info');

        var itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        var userStatus = document.createElement('div');
        userStatus.classList.add('user-status');
        
        var usernameSpan = document.createElement('span');
        usernameSpan.classList.add('user-username');
        usernameSpan.textContent = `Username: ${user.username}`;

        var isLandlordSpan = document.createElement('span');
        isLandlordSpan.classList.add('user-is-landlord');

        if(user.is_landlord) {
            isLandlordSpan.textContent = `Role: Owner`;
        } else {
            isLandlordSpan.textContent = `Role: User`;
        }
        
        userStatus.appendChild(usernameSpan);
        userStatus.appendChild(isLandlordSpan);

        var userMainInfo = document.createElement('div');
        userMainInfo.classList.add('user-main-info');
        userMainInfo.classList.add('sub-info');
        
        var passwordSpan = document.createElement('span');
        passwordSpan.classList.add('user-password');
        passwordSpan.textContent = `Password: ${user.password}`;

        var emailSpan = document.createElement('span');
        emailSpan.classList.add('user-email');
        emailSpan.textContent = `Email: ${user.email}`;
        
        var telephoneSpan = document.createElement('span');
        telephoneSpan.classList.add('user-telephone');
        telephoneSpan.textContent = `Telephone: ${user.telephone}`;

        var licenseSpan = document.createElement('span');
        licenseSpan.classList.add('user-license');
        licenseSpan.textContent = `License: ${user.license}`;

        userMainInfo.appendChild(passwordSpan);
        userMainInfo.appendChild(emailSpan);
        userMainInfo.appendChild(telephoneSpan);
        userMainInfo.appendChild(licenseSpan);

        var userSecondaryInfo = document.createElement('div');
        userSecondaryInfo.classList.add('user-secondary-info');
        userSecondaryInfo.classList.add('sub-info');

        var dateOfBirthSpan = document.createElement('span');
        dateOfBirthSpan.classList.add('user-date-of-birth');
        dateOfBirthSpan.textContent = `Date of birth: ${user.date_of_birth}`;

        var addressSpan = document.createElement('span');
        addressSpan.classList.add('user-address');
        addressSpan.textContent = `Address: ${user.address}`;

        userSecondaryInfo.appendChild(dateOfBirthSpan);
        userSecondaryInfo.appendChild(addressSpan);

        var updateButton = document.createElement('button');
        updateButton.classList.add('update-button');
        updateButton.setAttribute('id', `update-button-${user.id}`);
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateUser(user.id));

        var blockButton = document.createElement('button');
        blockButton.classList.add('block-button');
        blockButton.setAttribute('id', `block-button-${user.id}`);
        blockButton.textContent = 'Block';
        blockButton.addEventListener('click', () => blockUser(user.id));

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('id', `delete-button-${user.id}`);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteUser(user.id));

        itemInfo.appendChild(userStatus);
        itemInfo.appendChild(userMainInfo);
        itemInfo.appendChild(userSecondaryInfo);
        itemButtons.appendChild(updateButton);
        itemButtons.appendChild(deleteButton);
        itemButtons.appendChild(blockButton);

        listItem.appendChild(itemInfo);
        listItem.appendChild(itemButtons);

        existingUsersList.appendChild(listItem);
    });

    adminContent.appendChild(existingUsersList);
}


function GetExistingUsers() {
    var userControlLi = document.getElementById("user-control-li");

    if(userControlLi) {
        userControlLi.addEventListener('click', function(event) {
            event.preventDefault(); 
            renderExistingUsers();
        });
    }
}


async function updateUser(userId) {
    let response = await fetch(`http://127.0.0.1:8000/users/get_user/${userId}`, {
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
    modalHeader.textContent = 'Update User';

    var usernameInput = document.createElement('input');
    usernameInput.setAttribute('id', 'modal-username-input');
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Enter username:';
    usernameInput.value = result.username;

    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('id', 'modal-password-input');
    passwordInput.type = 'text';
    passwordInput.placeholder = 'Enter password:';
    passwordInput.value = result.password;

    var emailInput = document.createElement('input');
    emailInput.setAttribute('id', 'modal-email-input');
    emailInput.type = 'text';
    emailInput.placeholder = 'Enter email:';
    emailInput.value = result.email;

    var telephoneInput = document.createElement('input');
    telephoneInput.setAttribute('id', 'modal-telephone-input');
    telephoneInput.type = 'text';
    telephoneInput.placeholder = 'Enter telephone:';
    telephoneInput.value = result.telephone;

    var addressInput = document.createElement('input');
    addressInput.setAttribute('id', 'modal-address-input');
    addressInput.type = 'text';
    addressInput.placeholder = 'Enter address';
    addressInput.value = result.address;

    var licenseInput = document.createElement('input');
    licenseInput.setAttribute('id', 'modal-license-input');
    licenseInput.type = 'text';
    licenseInput.placeholder = 'Enter license:';
    licenseInput.value = result.license;

    var dateOfBirthInput = document.createElement('input');
    dateOfBirthInput.setAttribute('id', 'modal-date-of-birth-input');
    dateOfBirthInput.type = 'text';
    dateOfBirthInput.placeholder = 'Enter date of birth:';
    dateOfBirthInput.value = result.date_of_birth;

    var isLandlordDiv = document.createElement('div');
    isLandlordDiv.setAttribute('id', 'is-landlord-div');
    isLandlordDiv.style.display = 'flex';
    
    var ownerStatusLabel = document.createElement('label');
    ownerStatusLabel.setAttribute('for', 'modal-is-landlord-checkbox');
    ownerStatusLabel.textContent = 'Owner:';

    var isLandlordCheckbox = document.createElement('input');
    isLandlordCheckbox.setAttribute('id', 'modal-is-landlord-checkbox');
    isLandlordCheckbox.type = 'checkbox';
    isLandlordCheckbox.checked = result.is_landlord;

    isLandlordDiv.appendChild(ownerStatusLabel);
    isLandlordDiv.appendChild(isLandlordCheckbox);

    var okButton = document.createElement('button');
    okButton.classList.add('ok-button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', async function () {
        var modalUserUsername = document.getElementById('modal-username-input').value.trim();
        var modalUserPassword = document.getElementById('modal-password-input').value.trim();
        var modalUserEmail = document.getElementById('modal-email-input').value.trim();
        var modalUserTelephone = document.getElementById('modal-telephone-input').value.trim();
        var modalUserAddress = document.getElementById('modal-address-input').value.trim();
        var modalUserLicense = document.getElementById('modal-license-input').value.trim();
        var modalUserDateOfBirth = document.getElementById('modal-date-of-birth-input').value.trim();
        var modalIsLandlord = document.getElementById('modal-is-landlord-checkbox').checked;
        var isLandlord = false;

        if (modalIsLandlord) { isLandlord = true; }

        let response = await fetch(`http://127.0.0.1:8000/users/stuff_update_user/${userId}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': `${modalUserUsername}`,
                'password': `${modalUserPassword}`, 
                'email': `${modalUserEmail}`,
                'telephone': `${modalUserTelephone}`,
                'address': `${modalUserAddress}`,
                'license': `${modalUserLicense}`,
                'date_of_birth': `${modalUserDateOfBirth}`,
                'is_landlord': `${isLandlord}`,
            })
        });
        let result = await response.json();
        console.log(result);    
        closeModal();
        renderExistingUsers();
    });

    var cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeModal);

    modal.appendChild(modalHeader);
    modal.appendChild(usernameInput);
    modal.appendChild(passwordInput);
    modal.appendChild(emailInput);
    modal.appendChild(telephoneInput);
    modal.appendChild(addressInput);
    modal.appendChild(licenseInput);
    modal.appendChild(dateOfBirthInput);
    modal.appendChild(isLandlordDiv);
    modal.appendChild(okButton);
    modal.appendChild(cancelButton);

    modalBackground.appendChild(modal);

    document.body.appendChild(modalBackground);

}


async function createUser() {  
    var modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background');

    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalHeader = document.createElement('h2');
    modalHeader.textContent = 'Create User';

    var usernameInput = document.createElement('input');
    usernameInput.setAttribute('id', 'modal-username-input');
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Enter username:';

    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('id', 'modal-password-input');
    passwordInput.type = 'text';
    passwordInput.placeholder = 'Enter password:';

    var emailInput = document.createElement('input');
    emailInput.setAttribute('id', 'modal-email-input');
    emailInput.type = 'text';
    emailInput.placeholder = 'Enter email:';

    var telephoneInput = document.createElement('input');
    telephoneInput.setAttribute('id', 'modal-telephone-input');
    telephoneInput.type = 'text';
    telephoneInput.placeholder = 'Enter telephone:';

    var addressInput = document.createElement('input');
    addressInput.setAttribute('id', 'modal-address-input');
    addressInput.type = 'text';
    addressInput.placeholder = 'Enter address';

    var licenseInput = document.createElement('input');
    licenseInput.setAttribute('id', 'modal-license-input');
    licenseInput.type = 'text';
    licenseInput.placeholder = 'Enter license:';

    var dateOfBirthInput = document.createElement('input');
    dateOfBirthInput.setAttribute('id', 'modal-date-of-birth-input');
    dateOfBirthInput.type = 'text';
    dateOfBirthInput.placeholder = 'Enter date of birth:';

    var isLandlordDiv = document.createElement('div');
    isLandlordDiv.setAttribute('id', 'is-landlord-div');
    isLandlordDiv.style.display = 'flex';
    
    var ownerStatusLabel = document.createElement('label');
    ownerStatusLabel.setAttribute('for', 'modal-is-landlord-checkbox');
    ownerStatusLabel.textContent = 'Owner:';

    var isLandlordCheckbox = document.createElement('input');
    isLandlordCheckbox.setAttribute('id', 'modal-is-landlord-checkbox');
    isLandlordCheckbox.type = 'checkbox';

    isLandlordDiv.appendChild(ownerStatusLabel);
    isLandlordDiv.appendChild(isLandlordCheckbox);

    var okButton = document.createElement('button');
    okButton.classList.add('ok-button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', async function () {
        var modalUserUsername = document.getElementById('modal-username-input').value.trim();
        var modalUserPassword = document.getElementById('modal-password-input').value.trim();
        var modalUserEmail = document.getElementById('modal-email-input').value.trim();
        var modalUserTelephone = document.getElementById('modal-telephone-input').value.trim();
        var modalUserAddress = document.getElementById('modal-address-input').value.trim();
        var modalUserLicense = document.getElementById('modal-license-input').value.trim();
        var modalUserDateOfBirth = document.getElementById('modal-date-of-birth-input').value.trim();
        var modalIsLandlord = document.getElementById('modal-is-landlord-checkbox').checked;
        var isLandlord = false;

        let isValid = true;

        if (!modalUserUsername) {
            isValid = false;
            alert('Username field is required.');
        } else if (modalUserUsername.length > 50) {
            isValid = false;
            alert('Username field must be less than 50 characters.');
        }

        if (!modalUserPassword) {
            isValid = false;
            alert('Password field is required.');
        } else if (modalUserPassword.length > 50) {
            isValid = false;
            alert('Password field must be less than 50 characters.');
        }

        if (!modalUserEmail) {
            isValid = false;
            alert('Email field is required.');
        } else if (modalUserEmail.length > 100) {
            isValid = false;
            alert('Email field must be less than 100 characters.');
        } else if (!modalUserEmail.includes('@') || !modalUserEmail.includes('.com')) {
            isValid = false;
            alert('Email field must include "@" and ".com".');
        }

        if (!modalUserTelephone) {
            isValid = false;
            alert('Telephone field is required.');
        } else if (!modalUserTelephone.startsWith('+')) {
            isValid = false;
            alert('Telephone field must start with "+" symbol.');
        } else if (isNaN(modalUserTelephone.slice(1))) {
            isValid = false;
            alert('Telephone field must include only digits.');
        }

        if (!modalUserAddress) {
            isValid = false;
            alert('Address field is required.');
        } else if (modalUserAddress.length > 100) {
            isValid = false;
            alert('Address field must be less than 100 characters.');
        }

        if (!modalUserLicense) {
            isValid = false;
            alert('License number field is required.');
        } else if (!/^[A-Z]{4}\d+$/.test(modalUserLicense)) {
            isValid = false;
            alert('License number must start with four uppercase letters, followed by digits only.');
        } else if (modalUserLicense.length !== 10) {
            isValid = false;
            alert('License number must be 10 characters long.');
        }

        if (!modalUserDateOfBirth) {
            isValid = false;
            alert('Invalid date of birth.');
        } else {
            const cutoffDate = new Date();
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 18);
            if (modalUserDateOfBirth > cutoffDate) {
                isValid = false;
                alert('You must be at least 18 years old to be updated.');
            }
        }

        if (modalIsLandlord) { isLandlord = true; }

        if(isValid) {
            let response = await fetch('http://127.0.0.1:8000/users/registration', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': `${modalUserUsername}`,
                    'password': `${modalUserPassword}`, 
                    'email': `${modalUserEmail}`,
                    'telephone': `${modalUserTelephone}`,
                    'address': `${modalUserAddress}`,
                    'license': `${modalUserLicense}`,
                    'date_of_birth': `${modalUserDateOfBirth}`,
                    'is_landlord': `${isLandlord}`,
                })
            });
            let result = await response.json();
            console.log(result);    
        }
        closeModal();
        renderExistingUsers();
    });

    var cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeModal);

    modal.appendChild(modalHeader);
    modal.appendChild(usernameInput);
    modal.appendChild(passwordInput);
    modal.appendChild(emailInput);
    modal.appendChild(telephoneInput);
    modal.appendChild(addressInput);
    modal.appendChild(licenseInput);
    modal.appendChild(dateOfBirthInput);
    modal.appendChild(isLandlordDiv);
    modal.appendChild(okButton);
    modal.appendChild(cancelButton);

    modalBackground.appendChild(modal);

    document.body.appendChild(modalBackground);
}


async function deleteUser(userId) {
    var confirmDelete = window.confirm("Are you sure you want to delete user?");
    
    if(confirmDelete) {
        await fetch(`http://127.0.0.1:8000/users/delete_user/${userId}`, {
        method: 'DELETE',
        });

        renderExistingUsers();
    } else {
        console.log("Passed");
    }
}


async function blockUser(userId) {
    var confirmBlock = window.confirm("Are you sure you want to block user?");
    
    if(confirmBlock) {
        await fetch(`http://127.0.0.1:8000/users/block_user/${userId}`, {
        method: 'POST',
        });

        renderExistingUsers();
    } else {
        console.log("Passed");
    }
}


async function renderExistingCars() {
    var adminContent = document.querySelector('.admin-content');
    adminContent.innerHTML = '';

    var existingCarsList = document.createElement('ul');
    existingCarsList.classList.add('existing-list');

    let response = await fetch('http://127.0.0.1:8000/cars/get_stuff_cars', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let cars = dict.data;
    console.log(cars);

    cars.forEach(car => {
        var listItem = document.createElement('li');
        listItem.classList.add('list-item');

        var itemInfo = document.createElement('div');
        itemInfo.classList.add('large-item-info');

        var itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        var carOwner = document.createElement('div');
        carOwner.classList.add('car-owner');
        
        var ownernameSpan = document.createElement('span');
        ownernameSpan.classList.add('car-ownername');
        ownernameSpan.textContent = `Ownername: ${car.username}`;

        carOwner.appendChild(ownernameSpan);

        var carMainInfo = document.createElement('div');
        carMainInfo.classList.add('car-main-info');
        carMainInfo.classList.add('sub-info');
        
        var brandSpan = document.createElement('span');
        brandSpan.classList.add('car-brand');
        brandSpan.textContent = `Brand: ${car.brand}`;

        var modelSpan = document.createElement('span');
        modelSpan.classList.add('car-model');
        modelSpan.textContent = `Model: ${car.model}`;

        var registrationPlateSpan = document.createElement('span');
        registrationPlateSpan.classList.add('car-registration-plate');
        registrationPlateSpan.textContent = `Plates: ${car.registration_plate}`;
        
        var priceSpan = document.createElement('span');
        priceSpan.classList.add('car-price');
        priceSpan.textContent = `Price: ${car.day_price}$`;

        carMainInfo.appendChild(brandSpan);
        carMainInfo.appendChild(modelSpan);
        carMainInfo.appendChild(registrationPlateSpan);
        carMainInfo.appendChild(priceSpan);

        var carSecondaryInfo = document.createElement('div');
        carSecondaryInfo.classList.add('car-secondary-info');
        carSecondaryInfo.classList.add('sub-info');

        var categorySpan = document.createElement('span');
        categorySpan.classList.add('car-category');
        categorySpan.textContent = `Category: ${car.category}`;

        var fuelTypeSpan = document.createElement('span');
        fuelTypeSpan.classList.add('car-fuel-type');
        fuelTypeSpan.textContent = `Fuel type: ${car.fuel_type}`;

        var seatsCountSpan = document.createElement('span');
        seatsCountSpan.classList.add('car-seats-count');
        seatsCountSpan.textContent = `Seats count: ${car.seats_count}`;

        var colorSpan = document.createElement('span');
        colorSpan.classList.add('car-color');
        colorSpan.textContent = `Color: ${car.color}`;

        carSecondaryInfo.appendChild(categorySpan);
        carSecondaryInfo.appendChild(fuelTypeSpan);
        carSecondaryInfo.appendChild(seatsCountSpan);
        carSecondaryInfo.appendChild(colorSpan);

        var carDescriptionInfo = document.createElement('div');
        carDescriptionInfo.classList.add('car-description-info');
        carDescriptionInfo.classList.add('sub-info');

        var descriptionSpan = document.createElement('span');
        descriptionSpan.classList.add('car-description');
        var truncatedDescription = car.description.slice(0, 110);

        if (car.description.length > 110) {
            truncatedDescription += '...';
        }

        descriptionSpan.textContent = `Description: ${truncatedDescription}`;

        carDescriptionInfo.appendChild(descriptionSpan);

        var updateButton = document.createElement('button');
        updateButton.classList.add('update-button');
        updateButton.setAttribute('id', `update-button-${car.id}`);
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateCar(car.id));

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('id', `delete-button-${car.id}`);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteCar(car.id));

        itemInfo.appendChild(carOwner);
        itemInfo.appendChild(carMainInfo);
        itemInfo.appendChild(carSecondaryInfo);
        itemInfo.appendChild(carDescriptionInfo);
        itemButtons.appendChild(updateButton);
        itemButtons.appendChild(deleteButton);

        listItem.appendChild(itemInfo);
        listItem.appendChild(itemButtons);

        existingCarsList.appendChild(listItem);
    });

    adminContent.appendChild(existingCarsList);
}


function GetExistingCars() {
    var carControlLi = document.getElementById("car-control-li");

    if(carControlLi) {
        carControlLi.addEventListener('click', function(event) {
            event.preventDefault(); 
            renderExistingCars();
        });
    }
}


async function updateCar(carId) {
    let response = await fetch(`http://127.0.0.1:8000/cars/${carId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let result = await response.json();
    result = result.data;
    console.log(result);

    var modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background');

    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalHeader = document.createElement('h2');
    modalHeader.textContent = 'Update Car';

    var brandInput = document.createElement('input');
    brandInput.setAttribute('id', 'modal-brand-input');
    brandInput.type = 'text';
    brandInput.placeholder = 'Enter brand:';
    brandInput.value = result.brand;

    var modelInput = document.createElement('input');
    modelInput.setAttribute('id', 'modal-model-input');
    modelInput.type = 'text';
    modelInput.placeholder = 'Enter model:';
    modelInput.value = result.model;

    var categoryInput = document.createElement('input');
    categoryInput.setAttribute('id', 'modal-category-input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter category:';
    categoryInput.value = result.category;

    var fuelTypeInput = document.createElement('input');
    fuelTypeInput.setAttribute('id', 'modal-fuel-type-input');
    fuelTypeInput.type = 'text';
    fuelTypeInput.placeholder = 'Enter fuel type:';
    fuelTypeInput.value = result.fuel_type;

    var seatsCountInput = document.createElement('input');
    seatsCountInput.setAttribute('id', 'modal-seats-count-input');
    seatsCountInput.type = 'text';
    seatsCountInput.placeholder = 'Enter seats count';
    seatsCountInput.value = result.seats_count;

    var colorInput = document.createElement('input');
    colorInput.setAttribute('id', 'modal-color-input');
    colorInput.type = 'text';
    colorInput.placeholder = 'Enter color:';
    colorInput.value = result.color;

    var registrationPlateInput = document.createElement('input');
    registrationPlateInput.setAttribute('id', 'modal-registration-plate-input');
    registrationPlateInput.type = 'text';
    registrationPlateInput.placeholder = 'Enter registration plate:';
    registrationPlateInput.value = result.registration_plate;

    var dayPriceInput = document.createElement('input');
    dayPriceInput.setAttribute('id', 'modal-day-price-input');
    dayPriceInput.type = 'text';
    dayPriceInput.placeholder = 'Enter day price:';
    dayPriceInput.value = result.day_price;

    var firstImageUrlInput = document.createElement('input');
    firstImageUrlInput.setAttribute('id', 'modal-first-image-url-input');
    firstImageUrlInput.type = 'text';
    firstImageUrlInput.placeholder = 'Enter first umage url:';
    firstImageUrlInput.value = result.first_image_url;

    var secImageUrlInput = document.createElement('input');
    secImageUrlInput.setAttribute('id', 'modal-sec-image-url-input');
    secImageUrlInput.type = 'text';
    secImageUrlInput.placeholder = 'Enter second umage url:';
    secImageUrlInput.value = result.sec_image_url;

    var thirdImageUrlInput = document.createElement('input');
    thirdImageUrlInput.setAttribute('id', 'modal-third-image-url-input');
    thirdImageUrlInput.type = 'text';
    thirdImageUrlInput.placeholder = 'Enter third umage url:';
    thirdImageUrlInput.value = result.third_image_url;

    var descriptionInput = document.createElement('input');
    descriptionInput.setAttribute('id', 'modal-description-input');
    descriptionInput.type = 'text';
    descriptionInput.placeholder = 'Enter description:';
    descriptionInput.value = result.description;

    var okButton = document.createElement('button');
    okButton.classList.add('ok-button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', async function () {
        var modalCarBrand = document.getElementById('modal-brand-input').value.trim();
        var modalCarModel = document.getElementById('modal-model-input').value.trim();
        var modalCarCategory = document.getElementById('modal-category-input').value.trim();
        var modalCarFuelType = document.getElementById('modal-fuel-type-input').value.trim();
        var modalCarSeatsCount = document.getElementById('modal-seats-count-input').value.trim();
        var modalCarColor = document.getElementById('modal-color-input').value.trim();
        var modalCarRegistrationPlate = document.getElementById('modal-registration-plate-input').value.trim();
        var modalCarDayPrice = document.getElementById('modal-day-price-input').value.trim();
        var modalCarFirstImageUrl = document.getElementById('modal-first-image-url-input').value.trim();
        var modalCarSecImageUrl = document.getElementById('modal-sec-image-url-input').value.trim();
        var modalCarThirdImageUrl = document.getElementById('modal-third-image-url-input').value.trim();
        var modalCarDescription = document.getElementById('modal-description-input').value.trim();

        let response = await fetch(`http://127.0.0.1:8000/cars/update_car/${carId}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "brand" : `${modalCarBrand}`,
                "model" : `${modalCarModel}`,
                "category" : `${modalCarCategory}`,
                "fuel_type" : `${modalCarFuelType}`,
                "seats_count" : `${modalCarSeatsCount}`,
                "color" : `${modalCarColor}`,
                "registration_plate" : `${modalCarRegistrationPlate}`,
                "day_price" : `${modalCarDayPrice}`,
                "first_image_url" : `${modalCarFirstImageUrl}`,
                "sec_image_url" : `${modalCarSecImageUrl}`,
                "third_image_url" : `${modalCarThirdImageUrl}`,
                "description" : `${modalCarDescription}`,
            })
        });
        let result = await response.json();
        console.log(result);
        closeModal();
        renderExistingCars();
    });

    var cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeModal);

    modal.appendChild(modalHeader);
    modal.appendChild(brandInput);
    modal.appendChild(modelInput);
    modal.appendChild(categoryInput);
    modal.appendChild(fuelTypeInput);
    modal.appendChild(seatsCountInput);
    modal.appendChild(colorInput);
    modal.appendChild(registrationPlateInput);
    modal.appendChild(dayPriceInput);
    modal.appendChild(firstImageUrlInput);
    modal.appendChild(secImageUrlInput);
    modal.appendChild(thirdImageUrlInput);
    modal.appendChild(descriptionInput);
    modal.appendChild(okButton);
    modal.appendChild(cancelButton);

    modalBackground.appendChild(modal);

    document.body.appendChild(modalBackground);

}


async function deleteCar(carId) {
    var confirmDelete = window.confirm("Are you sure you want to delete car?");
    
    if(confirmDelete) {
        await fetch(`http://127.0.0.1:8000/cars/${carId}`, {
        method: 'DELETE',
        });

        renderExistingCars();
    } else {
        console.log("Passed");
    }
}


async function renderExistingRents() {
    var adminContent = document.querySelector('.admin-content');
    adminContent.innerHTML = '';

    var existingRentsList = document.createElement('ul');
    existingRentsList.classList.add('existing-list');

    let response = await fetch('http://127.0.0.1:8000/rental_deal', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let rents = dict.data;
    console.log(rents);

    rents.forEach(rent => {
        var listItem = document.createElement('li');
        listItem.classList.add('list-item');

        var itemInfo = document.createElement('div');
        itemInfo.classList.add('large-item-info');

        var itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        var rentUsernameInfo = document.createElement('div');
        rentUsernameInfo.classList.add('rent-user');
        
        var usernameSpan = document.createElement('span');
        usernameSpan.classList.add('rent-username');
        usernameSpan.textContent = `Rentername: ${rent.username}`;
 
        rentUsernameInfo.appendChild(usernameSpan);

        var rentCarInfo = document.createElement('div');
        rentCarInfo.classList.add('car-info');
        rentCarInfo.classList.add('sub-info');
        
        var brandSpan = document.createElement('span');
        brandSpan.classList.add('car-brand');
        brandSpan.textContent = `Brand: ${rent.brand}`;

        var modelSpan = document.createElement('span');
        modelSpan.classList.add('car-model');
        modelSpan.textContent = `Model: ${rent.model}`;

        var registrationPlateSpan = document.createElement('span');
        registrationPlateSpan.classList.add('car-registration-plate');
        registrationPlateSpan.textContent = `Plates: ${rent.registration_plate}`;

        rentCarInfo.appendChild(brandSpan);
        rentCarInfo.appendChild(modelSpan);
        rentCarInfo.appendChild(registrationPlateSpan);

        var rentLocationInfo = document.createElement('div');
        rentLocationInfo.classList.add('rent-location-info');
        rentLocationInfo.classList.add('sub-info');

        var receptionPointSpan = document.createElement('span');
        receptionPointSpan.classList.add('rent-reception-point');
        receptionPointSpan.textContent = `Start location: ${rent.reception_point}`;

        var issuePointSpan = document.createElement('span');
        issuePointSpan.classList.add('rent-issue-point');
        issuePointSpan.textContent = `End location: ${rent.issue_point}`;

        rentLocationInfo.appendChild(receptionPointSpan);
        rentLocationInfo.appendChild(issuePointSpan);

        var rentDateInfo = document.createElement('div');
        rentDateInfo.classList.add('rent-date-info');
        rentDateInfo.classList.add('sub-info');

        var startDateSpan = document.createElement('span');
        startDateSpan.classList.add('rent-start-date');
        startDateSpan.textContent = `Start date: ${rent.start_date}`;

        var endDateSpan = document.createElement('span');
        endDateSpan.classList.add('rent-end-date');
        endDateSpan.textContent = `End date: ${rent.end_date}`;

        rentDateInfo.appendChild(startDateSpan);
        rentDateInfo.appendChild(endDateSpan);

        var rentPriceInfo = document.createElement('div');
        rentPriceInfo.classList.add('rent-price-info');
        rentPriceInfo.classList.add('sub-info');

        var priceSpan = document.createElement('span');
        priceSpan.classList.add('rent-price');
        priceSpan.textContent = `Total price: ${rent.total_price}$`;

        rentPriceInfo.appendChild(priceSpan);

        var updateButton = document.createElement('button');
        updateButton.classList.add('update-button');
        updateButton.setAttribute('id', `update-button-${rent.id}`);
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateRent(rent.id));

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('id', `delete-button-${rent.id}`);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteRent(rent.id));

        itemInfo.appendChild(rentUsernameInfo);
        itemInfo.appendChild(rentCarInfo);
        itemInfo.appendChild(rentLocationInfo);
        itemInfo.appendChild(rentDateInfo);
        itemInfo.appendChild(rentPriceInfo);
        itemButtons.appendChild(updateButton);
        itemButtons.appendChild(deleteButton);

        listItem.appendChild(itemInfo);
        listItem.appendChild(itemButtons);

        existingRentsList.appendChild(listItem);
    });

    adminContent.appendChild(existingRentsList);
}


function GetExistingRents() {
    var rentControlLi = document.getElementById("rent-control-li");

    if(rentControlLi) {
        rentControlLi.addEventListener('click', function(event) {
            event.preventDefault(); 
            renderExistingRents();
        });
    }
}


async function updateRent(rentalDealId) {
    let response = await fetch(`http://127.0.0.1:8000/rental_deal/get_rental_deal/${rentalDealId}`, {
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
    modalHeader.textContent = 'Update Rental Deal';

    var startDateInput = document.createElement('input');
    startDateInput.setAttribute('id', 'modal-start-date-input');
    startDateInput.type = 'text';
    startDateInput.placeholder = 'Enter start date:';
    startDateInput.value = result.start_date;

    var endDateInput = document.createElement('input');
    endDateInput.setAttribute('id', 'modal-end-date-input');
    endDateInput.type = 'text';
    endDateInput.placeholder = 'Enter end date:';
    endDateInput.value = result.end_date;

    var receptionPointInput = document.createElement('input');
    receptionPointInput.setAttribute('id', 'modal-reception-point-input');
    receptionPointInput.type = 'text';
    receptionPointInput.placeholder = 'Enter start location:';
    receptionPointInput.value = result.reception_point;

    var issuePointInput = document.createElement('input');
    issuePointInput.setAttribute('id', 'modal-issue-point-input');
    issuePointInput.type = 'text';
    issuePointInput.placeholder = 'Enter end point:';
    issuePointInput.value = result.issue_point;

    var totalPriceInput = document.createElement('input');
    totalPriceInput.setAttribute('id', 'modal-total-price-input');
    totalPriceInput.type = 'text';
    totalPriceInput.placeholder = 'Enter total price';
    totalPriceInput.value = result.total_price;

    var okButton = document.createElement('button');
    okButton.classList.add('ok-button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', async function () {
        var modalRentStartDate = document.getElementById('modal-start-date-input').value.trim();
        var modalRentEndDate = document.getElementById('modal-end-date-input').value.trim();
        var modalRentReceptionPoint = document.getElementById('modal-reception-point-input').value.trim();
        var modalRentIssuePoint = document.getElementById('modal-issue-point-input').value.trim();
        var modalRentTotalPrice = document.getElementById('modal-total-price-input').value.trim();

        let response = await fetch(`http://127.0.0.1:8000/rental_deal/update_rental_deal/${rentalDealId}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'start_date': `${modalRentStartDate}`,
                'end_date': `${modalRentEndDate}`, 
                'reception_point': `${modalRentReceptionPoint}`,
                'issue_point': `${modalRentIssuePoint}`,
                'total_price': `${modalRentTotalPrice}`,
            })
        });
        let result = await response.json();
        console.log(result);    
        closeModal();
        renderExistingRents();
    });

    var cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeModal);

    modal.appendChild(modalHeader);
    modal.appendChild(startDateInput);
    modal.appendChild(endDateInput);
    modal.appendChild(receptionPointInput);
    modal.appendChild(issuePointInput);
    modal.appendChild(totalPriceInput);
    modal.appendChild(okButton);
    modal.appendChild(cancelButton);

    modalBackground.appendChild(modal);

    document.body.appendChild(modalBackground);
}


async function deleteRent(rentalDealId) {
    var confirmDelete = window.confirm("Are you sure you want to delete rental deal?");
    
    if(confirmDelete) {
        await fetch(`http://127.0.0.1:8000/rental_deal/delete_rental_deal/${rentalDealId}`, {
        method: 'DELETE',
        });

        renderExistingRents();
    } else {
        console.log("Passed");
    }
}


async function renderExistingReviews() {
    var adminContent = document.querySelector('.admin-content');
    adminContent.innerHTML = '';

    var existingReviewsList = document.createElement('ul');
    existingReviewsList.classList.add('existing-list');

    let response = await fetch('http://127.0.0.1:8000/reviews', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let reviews = dict.data;

    reviews.forEach(review => {
        var listItem = document.createElement('li');
        listItem.classList.add('list-item');

        var itemInfo = document.createElement('div');
        itemInfo.classList.add('large-item-info');

        var itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        var usernameInfo = document.createElement('div');
        usernameInfo.classList.add('review-username-info');

        var usernameSpan = document.createElement('span');
        usernameSpan.classList.add('review-username');
        usernameSpan.textContent = `Reviewer: ${review.username}`;

        usernameInfo.appendChild(usernameSpan);

        var carInfo = document.createElement('div');
        carInfo.classList.add('review-car-info');
        carInfo.classList.add('sub-info');
        
        var brandSpan = document.createElement('span');
        brandSpan.classList.add('review-brand');
        brandSpan.textContent = `Brand: ${review.brand}`;

        var modelSpan = document.createElement('span');
        modelSpan.classList.add('review-model');
        modelSpan.textContent = `Model: ${review.model}`;

        var registrationPlateSpan = document.createElement('span');
        registrationPlateSpan.classList.add('review-registration_plate');
        registrationPlateSpan.textContent = `Registration plate: ${review.registration_plate}`;

        carInfo.appendChild(brandSpan);
        carInfo.appendChild(modelSpan);
        carInfo.appendChild(registrationPlateSpan);

        var messageInfo = document.createElement('div');
        messageInfo.classList.add('review-message-info');
        messageInfo.classList.add('sub-info');

        var messageSpan = document.createElement('span');
        messageSpan.classList.add('review-message');
        var truncatedMessage = review.message.slice(0, 110);

        if (review.message.length > 110) {
            truncatedMessage += '...';
        }
        messageSpan.textContent = `Message: ${truncatedMessage}`;

        messageInfo.appendChild(messageSpan);

        var updateButton = document.createElement('button');
        updateButton.classList.add('update-button');
        updateButton.setAttribute('id', `update-button-${review.id}`);
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateReview(review.id));

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('id', `delete-button-${review.id}`);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteReview(review.id));

        itemInfo.appendChild(usernameInfo);
        itemInfo.appendChild(carInfo);
        itemInfo.appendChild(messageInfo);
        itemButtons.appendChild(updateButton);
        itemButtons.appendChild(deleteButton);

        listItem.appendChild(itemInfo);
        listItem.appendChild(itemButtons);

        existingReviewsList.appendChild(listItem);
    });

    adminContent.appendChild(existingReviewsList);
}


function GetExistingReviews() {
    var reviewControlLi = document.getElementById("review-control-li");

    if(reviewControlLi) {
        reviewControlLi.addEventListener('click', function(event) {
            event.preventDefault();  
            renderExistingReviews();
        });
    }
}


async function updateReview(reviewId) {
    let response = await fetch(`http://127.0.0.1:8000/reviews/review/${reviewId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    let dict = await response.json();
    let result = dict.data;
    console.log(result);

    var modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background');

    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalHeader = document.createElement('h2');
    modalHeader.textContent = 'Update Review';

    var messageInput = document.createElement('input');
    messageInput.setAttribute('id', 'modal-message-input');
    messageInput.type = 'text';
    messageInput.placeholder = 'Enter message:';
    messageInput.value = result.message;

    var okButton = document.createElement('button');
    okButton.classList.add('ok-button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', async function () {
        var modalReviewMessage = document.getElementById('modal-message-input').value.trim();
        console.log(modalReviewMessage);

        let response = await fetch(`http://127.0.0.1:8000/reviews/review_update/${reviewId}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'message': `${modalReviewMessage}`,
            })
        });
        let result = await response.json();
        console.log(result);    
        closeModal();
        renderExistingReviews();
    });

    var cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeModal);

    modal.appendChild(modalHeader);
    modal.appendChild(messageInput);
    modal.appendChild(okButton);
    modal.appendChild(cancelButton);

    modalBackground.appendChild(modal);

    document.body.appendChild(modalBackground);
}


async function deleteReview(reviewId) {
    var confirmDelete = window.confirm("Are you sure you want to delete review?");
    
    if(confirmDelete) {
        await fetch(`http://127.0.0.1:8000/reviews/${reviewId}`, {
        method: 'DELETE',
        });

        renderExistingReviews();
    } else {
        console.log("Passed");
    }
}


function InitFunctions() {
    GetStuffAbilities();
    StuffLogout();
}

InitFunctions();
