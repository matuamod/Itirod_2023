export async function Login() {
    if (localStorage.getItem('user_id')) {
        let response = await fetch(`http://127.0.0.1:8000/users/${localStorage.getItem('user_id')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            } 
        });
        let result = await response.json();

        var menuList = document.querySelector(".menu__list");

        var cartLi = document.createElement("li");
        cartLi.setAttribute("id", "cart-li");
        cartLi.setAttribute("class", "menu__item");
        var cartA = document.createElement("a");
        cartA.setAttribute("id", "cart-a");
        cartA.setAttribute("href", "/html/cart.html");
        cartA.setAttribute("class", "menu__link");
        cartA.innerHTML = "Cart";
        cartLi.appendChild(cartA);

        menuList.insertBefore(cartLi, document.getElementById("login-li"));

        var logoutLi = document.getElementById("login-li");
        var usernameLi = document.getElementById("register-li");

        var logoutA = document.createElement("a");
        logoutA.setAttribute("id", "login-a");
        logoutA.setAttribute("href", "/html/index.html");
        logoutA.setAttribute("class", "menu__link");
        logoutA.innerHTML = "Logout";

        var usernameA = document.createElement("a");
        usernameA.setAttribute("id", "register-a");
        usernameA.setAttribute("href", "/html/user_profile.html");
        usernameA.setAttribute("class", "menu__link");
        usernameA.innerHTML = result.username;

        logoutLi.replaceChild(logoutA, document.getElementById("login-a"));
        usernameLi.replaceChild(usernameA, document.getElementById("register-a"));

        if (result.is_landlord) {
            var headerContainer = document.querySelector(".header__container");
   
            var landlordCarsLi = document.createElement("li");
            landlordCarsLi.setAttribute("id", "landlord-cars-li");
            landlordCarsLi.setAttribute("class", "menu__item");

            var landlordCarsA = document.createElement("a");
            landlordCarsA.setAttribute("id", "landlord-cars-a");
            landlordCarsA.setAttribute("href", "/html/landlord_cars.html");
            landlordCarsA.setAttribute("class", "menu__link");
            landlordCarsA.innerHTML = "Your cars";

            landlordCarsLi.appendChild(landlordCarsA);
            menuList.appendChild(landlordCarsLi);
            
            var div = document.createElement("div");
            div.setAttribute("class", "header__button");
            div.style.flex = "0 0 200px";
            div.style.display = "flex";
            div.style.justifyContent = "flex-end";

            var a = document.createElement("a");
            a.setAttribute("href", "/html/add_car.html");
            a.setAttribute("class", "button-add-car");
            a.setAttribute("class", "button-blue");
            a.innerHTML = "Add car";
            a.style.display = "flex";
            a.style.justifyContent = "flex-end";
            a.style.fontSize = "25px";
            a.style.fontWeight = "bold";
            a.style.padding = "13px 30px";
            a.style.borderRadius = "25px";
            a.style.color = "#fbf7f7";
            a.style.transition = "box-shadow 0.15s";

            div.appendChild(a);
            headerContainer.appendChild(div);
        }
    }
}


export function Logout() {
    var loginLi = document.getElementById("login-li");

    if(loginLi.lastChild.innerHTML === "Logout") {
        loginLi.addEventListener('click', function(event) {
            event.preventDefault();
    
            if (localStorage.getItem("user_id")) {
                localStorage.removeItem("user_id");
        
                var registerLi = document.getElementById("register-li");
        
                var loginA = document.createElement("a");
                loginA.setAttribute("id", "login-a");
                loginA.setAttribute("href", "/html/login.html");
                loginA.setAttribute("class", "menu__link");
                loginA.innerHTML = "Login";
        
                var registerA = document.createElement("a");
                registerA.setAttribute("id", "register-a");
                registerA.setAttribute("href", "/html/register.html");
                registerA.setAttribute("class", "menu__link");
                registerA.innerHTML = "Register";
        
                loginLi.replaceChild(loginA, document.getElementById("login-a"));
                registerLi.replaceChild(registerA, document.getElementById("register-a"));
                
                var headerButton = document.querySelector(".header__button");
                var landlordCars = document.getElementById("landlord-cars-li");
                var cart = document.getElementById("cart-li");
                cart.remove();

                if (headerButton) {
                    headerButton.remove();
                    landlordCars.remove();
                }
                location.reload();
                window.location.href='index.html';
            }
        });
    }    
}
