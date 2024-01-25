
import {Login, Logout} from './header.js';

await Login();
Logout();

const upload = Upload({ apiKey: "public_12a1ynWGe8T2VyocVZmkqtwS3m9i" });
// const upload = Upload({ apiKey: "free" });

const button = document.querySelector('.button-save');

button.addEventListener('click', async function(event) {
    event.preventDefault();
    await AddCar();
});


function WarningOnAdd(str) {
    var photo_warning = document.getElementById(str);
    photo_warning.innerHTML = '';
    photo_warning.inrHTML = `Add a photo!`;
    photo_warning.style.marginLeft = '10px';
    photo_warning.style.color = '#A7361D';
}


async function onFileSelected(event, itemId) {
  const [ file ] = event.target.files;
  const { fileUrl } = await upload.uploadFile(file);

  var carImage = document.querySelector("." + `${itemId}`);
  carImage.src = fileUrl;

  console.log(`File uploaded: ${fileUrl}`);
}


async function AddCar() {
    var brand = document.getElementById("name").value;
    var model = document.getElementById("model").value;
    var category = document.getElementById("category").value;
    var fuel_type = document.getElementById("fuel-type").value;
    var seats_count = document.getElementById("seats-count").value;
    var color = document.getElementById("color").value;
    var plate = document.getElementById("plate").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var user_id = `${localStorage.getItem('user_id')}`;

    var base_photo = "http://127.0.0.1:5501/assets/src/add_car_photo.png";

    if (document.querySelector(".first-car-img").src === base_photo) {
        WarningOnAdd("first_photo_warning");
        alert("Add first car image!");
        return
    } else {
        var first_photo_url = document.querySelector(".first-car-img").src;
    }  

    if (document.querySelector(".second-car-img").src === base_photo) {
        WarningOnAdd("second_photo_warning");
        alert("Add second car image!");
        return
    } else {
        var second_photo_url = document.querySelector(".second-car-img").src;
    }

    if (document.querySelector(".third-car-img").src === base_photo) {
        WarningOnAdd("third_photo_warning");
        alert("Add third car image!");
        return
    } else {
        var third_photo_url = document.querySelector(".third-car-img").src;
    }
    
    let response = await fetch('http://127.0.0.1:8000/cars', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "owner_id" : `${user_id}`,
            "first_image_url" : `${first_photo_url}`,
            "sec_image_url" : `${second_photo_url}`,
            "third_image_url" : `${third_photo_url}`,
            "brand" : `${brand}`,
            "model" : `${model}`,
            "category" : `${category}`,
            "fuel_type" : `${fuel_type}`,
            "seats_count" : `${seats_count}`,
            "color" : `${color}`,
            "registration_plate" : `${plate}`,
            "day_price" : `${price}`,
            "description" : `${description}`,
        })
    });
    let result = await response.json();
    console.log(result);
    // window.location.href='index.html';

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
}


var carItems = document.querySelectorAll(".image-upload-input");

for (let carItem of carItems) {
    carItem.addEventListener("change", async function(event) {
        event.preventDefault();
        onFileSelected(event, carItem.id);
    });
}