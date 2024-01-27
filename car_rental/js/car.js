import {Login, Logout} from './header.js';

await Login();
Logout();


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


async function FillCarInf() {
    let response_car = await fetch(`http://127.0.0.1:8000/cars/${localStorage.getItem('car_id')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let result_car = await response_car.json();

    document.getElementById("car-content-title").innerHTML = `${result_car.brand} ` + `${result_car.model}`;

    document.getElementById("first-photo").src = result_car.first_image_url;
    document.getElementById("second-photo").src = result_car.sec_image_url;
    document.getElementById("third-photo").src = result_car.third_image_url;

    document.getElementById("car-card-title").innerHTML = `${result_car.description}`;
}

FillCarInf();


async function CalculatePrice() {
    var start_date = document.querySelector(".start_date").value;
    var end_date = document.querySelector(".end_date").value;

    if (!start_date) {
        alert("Choose start date of rend");
        return;
    }

    if (!end_date) {
        alert("Choose end date of rend");
        return;
    }

    if (start_date > end_date) {
        alert("Start date is more than end date");
        return;
    }

    let current_date = new Date().toJSON().slice(0, 10);

    if (start_date < current_date) {
        alert("Start date is less than current date");
        return;
    }

    if (end_date < current_date) {
        alert("End date is less than current date");
        return;
    }

    let response_car = await fetch(`http://127.0.0.1:8000/cars/${localStorage.getItem('car_id')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let result_car = await response_car.json();

    start_date = new Date(start_date);
    end_date = new Date(end_date);

    var difference = (end_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24) + 1;

    var rend_btn_block = document.querySelector(".rend_btn");

    var total_price = document.getElementById("total-price-value");
    var total = difference * result_car.day_price;
    total_price.innerHTML = `${total}` + "$";

    if (!document.getElementById("rend-price")) {
        var rend_price = document.createElement("span");
        rend_price.setAttribute("id", "rend-price");
        rend_price.innerHTML = "Rend: ";
        var rend_price_value = document.createElement("span");
        rend_price_value.setAttribute("id", "rend-price-value");
        var rend =parseFloat((total * 0.87).toFixed(2));
        rend_price_value.innerHTML = `${rend}` + "$";
        rend_btn_block.appendChild(rend_price);
        rend_btn_block.appendChild(rend_price_value);
    } else {
        var rend_price_value = document.getElementById("rend-price-value");
        var rend = parseFloat((total * 0.87).toFixed(2));
        rend_price_value.innerHTML = `${rend}` + "$";
    }

    if (!document.getElementById("tax-price")) {
        var tax_price = document.createElement("span");
        tax_price.setAttribute("id", "tax-price");
        tax_price.innerHTML = "Tax: ";
        var tax_price_value = document.createElement("span");
        tax_price_value.setAttribute("id", "tax-price-value");
        var tax = parseFloat((total * 0.13).toFixed(2));
        tax_price_value.innerHTML = `${tax}` + "$";
        rend_btn_block.appendChild(tax_price);
        rend_btn_block.appendChild(tax_price_value);
    } else {
        var tax_price_value = document.getElementById("tax-price-value");
        var tax = parseFloat((total * 0.13).toFixed(2));
        tax_price_value.innerHTML = `${tax}` + "$";
    }
    
}


async function RendCar() {
    if (!document.getElementById("rend-price")) {
        alert("Calculate total price for rend firstly");
        return;
    }

    if (!localStorage.getItem("user_id")) {
        alert("You should register to make a rend firstly");
        window.location.replace('register.html');
        return;
    }

    var start_date = document.querySelector(".start_date").value;
    var end_date = document.querySelector(".end_date").value;
    start_date = new Date(start_date);
    end_date = new Date(end_date);

    var total_price = document.getElementById("total-price-value").innerHTML;
    if (total_price === "0$") { return; }

    var start_location = document.querySelector(".start_location");
    var end_location = document.querySelector(".end_location");

    if (!start_location.value) {
        alert("Enter start location of rend");
        return;
    } else if (start_location.length > 100) {
        alert("Start location length is too large");
        return;
    }

    if (!end_location.value) {
        alert("Enter end location of rend");
        return;
    } else if (end_location.length > 100) {
        alert("End location length is too large");
        return;
    }

    let response = await fetch('http://127.0.0.1:8000/rental_deal', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'user_id': `${localStorage.getItem("user_id")}`,
          'car_id': `${localStorage.getItem("car_id")}`, 
          'start_date': `${formatDate(start_date)}`,
          'end_date': `${formatDate(end_date)}`,
          'reception_point': `${start_location.value}`,
          'issue_point': `${end_location.value}`,
          'total_price': `${total_price.replace("$", "")}`
        })
    });
    let result = await response.json();
    // alert(result.message)

    if(result.message=="Rental deal succesfully created") {
      alert(result.message);
      console.log(result.id);

      var stripe = Stripe(
        "pk_test_51OV92nFiAt0FTsnrjz5Pdd7Ysjg6qofpTbqtbaR8HCTMQcMdQoRFAVVHcPFPaURW7ObJWWOtASAx67hsd9FiAVnN00EOMSAOXf"
      );

      stripe.redirectToCheckout({
        lineItems: [
          {
            price: result.plan_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: "http://127.0.0.1:5501/html/index.html",
      }).then(function(result) {
          alert(result);
      });

      // window.location.replace('index.html');
    }
}


const buttonCalculate = document.getElementById("btn-calculate");

buttonCalculate.addEventListener('click', async function(event) {
    event.preventDefault();
    await CalculatePrice();
});


const buttonRend = document.getElementById("btn-rend-car");

buttonRend.addEventListener('click', async function(event) {
    event.preventDefault();
    await RendCar();
});