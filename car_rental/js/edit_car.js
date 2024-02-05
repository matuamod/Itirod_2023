import {Login, Logout} from './header.js';

await Login();
Logout();


function SetPhotoItem(fileUrl, photoWarning, urlStore) {
    localStorage.setItem(urlStore, `${fileUrl}`);
    var photo_warning = document.getElementById(photoWarning);
    photo_warning.style.marginLeft = '10px';
    photo_warning.style.color = 'black';
    photo_warning.innerHTML = `Prev`;
}


async function GetCar() {
    let response_car = await fetch(`http://127.0.0.1:8000/cars/${localStorage.getItem('car_id')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let result = await response_car.json();
    let result_car = result.data;
    console.log(result_car);

    document.getElementById("name").value = `${result_car.brand}`;
    document.getElementById("model").value = `${result_car.model}`;
    document.getElementById("category").value = `${result_car.category}`;
    document.getElementById("fuel-type").value = `${result_car.fuel_type}`;
    document.getElementById("seats-count").value = `${result_car.seats_count}`;
    document.getElementById("color").value = `${result_car.color}`;
    document.getElementById("plate").value = `${result_car.registration_plate}`;
    document.getElementById("price").value = `${result_car.day_price}`;
    document.getElementById("description").value = `${result_car.description}`;
    document.querySelector(".first-car-img").src = `${result_car.first_image_url}`;
    document.querySelector(".second-car-img").src = `${result_car.sec_image_url}`;
    document.querySelector(".third-car-img").src = `${result_car.third_image_url}`;

    SetPhotoItem(result_car.first_photo_url, "first_photo_warning", "first_photo_url");
    SetPhotoItem(result_car.second_photo_url, "second_photo_warning", "second_photo_url");
    SetPhotoItem(result_car.third_photo_url, "third_photo_warning", "third_photo_url");
}

GetCar();

const upload = Upload({ apiKey: "public_FW25bMB9XFDUGYefNCpbLpPopXM3" });


function PhotoWarning(str, url_store, fileUrl) {
    var photo_warning = document.getElementById(str);
    localStorage.setItem(url_store, fileUrl);
    photo_warning.innerHTML = '';
    photo_warning.innerHTML = `Added`;
    photo_warning.style.marginLeft = '10px';
    photo_warning.style.color = '#689D3E';
}


async function onFileSelected(event, itemId) {
    const [ file ]    = event.target.files;
    const { fileUrl } = await upload.uploadFile(file);
  
    PhotoWarning("first_photo_warning", "first_photo_url", fileUrl);
    PhotoWarning("second_photo_warning", "second_photo_url", fileUrl);
    PhotoWarning("third_photo_warning", "third_photo_url", fileUrl);
  
    var carImage = document.querySelector("." + `${itemId}`);
    carImage.src = fileUrl;

    console.log(`File uploaded: ${fileUrl}`);
}
  

async function EditCar() {
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
    var first_photo_url = document.querySelector(".first-car-img").src;
    var second_photo_url = document.querySelector(".second-car-img").src;
    var third_photo_url = document.querySelector(".third-car-img").src;
    
    console.log(brand);
    console.log(model);
    console.log(category);
    console.log(fuel_type);
    console.log(seats_count);
    console.log(color);
    console.log(plate);
    console.log(price);
    console.log(first_photo_url);
    console.log(second_photo_url);
    console.log(third_photo_url);
    console.log(description);
    console.log(user_id);
    
    let response = await fetch(`http://127.0.0.1:8000/cars/update_car/${localStorage.getItem("car_id")}`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "brand" : `${brand}`,
            "model" : `${model}`,
            "category" : `${category}`,
            "fuel_type" : `${fuel_type}`,
            "seats_count" : `${seats_count}`,
            "color" : `${color}`,
            "registration_plate" : `${plate}`,
            "day_price" : `${price}`,
            "first_image_url" : `${first_photo_url}`,
            "sec_image_url" : `${second_photo_url}`,
            "third_image_url" : `${third_photo_url}`,
            "description" : `${description}`,
        })
    });
    let result = await response.json();
    console.log(result);
    window.location.href='index.html';
}

const carItems = document.querySelectorAll(".image-upload-input");

for (let carItem of carItems) {
    carItem.addEventListener("change", async function(event) {
        event.preventDefault();
        onFileSelected(event, carItem.id);
    });
}

const editButton = document.querySelector(".button-save");

editButton.addEventListener('click', async function(event) {
    event.preventDefault();
    await EditCar();
});
