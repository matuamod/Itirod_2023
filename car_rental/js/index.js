import {Login, Logout} from './header.js';

await Login();
Logout();

const button = document.querySelector('.button-search');

button.addEventListener('click', async function(event) {
    event.preventDefault();
    await GetCars(ConfigureUrl());
});


function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }


async function FillCurrSortSet(sortItems, id) {
    removeOptions(document.getElementById(id));

    var select = document.getElementById(id);
    var option = document.createElement("option");
    option.setAttribute('selected', true);
    option.setAttribute('disabled', true);
    option.innerHTML = `-- ${id} --`;
    select.appendChild(option);

    var uniqueSortItems = [...new Set(sortItems)];

    for (let item of uniqueSortItems){
        option = document.createElement("option");
        option.setAttribute('value', item);
        option.innerHTML = item;
        select.appendChild(option);
    }
}


async function FillAllSortSets() {
    let response = await fetch('http://127.0.0.1:8000/cars', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();
    const cars = result.data;
    const brand = new Array();
    const model = new Array();
    const cur_model = new Array();
    const type = new Array();
    const fuel_type = new Array();
    const color = new Array();

    for (let car of cars){

        if(car.hasOwnProperty('message')){
            continue
        }
        
        brand.push(`${car.brand}`);
        model.push(`${car.model}`);
        type.push(`${car.category}`);
        fuel_type.push(`${car.fuel_type}`);
        color.push(`${car.color}`);
    }
    
    await FillCurrSortSet(brand, "brand");

    var brand_select = document.getElementById("brand");

    brand_select.onchange = async function () {
        
        for (var i = 1; i < cars.length; i++) {
            if (cars[i].brand === brand_select.value && cars[i].model === model[i-1]) {
                cur_model.push(`${cars[i].model}`);
            }
        }
        await FillCurrSortSet(cur_model, "model");
        cur_model.length = 0;
    }

    await FillCurrSortSet(type, "type");
    await FillCurrSortSet(fuel_type, "fuel");
    await FillCurrSortSet(color, "color");
}


FillAllSortSets();


function SetCarsCount(count) {
    var preview = document.getElementById("section-preview");
    preview.innerHTML = `Now you can choose one of ${count} cars for rent here`;
}


function ConfigureUrl() {
    var brand = document.getElementById("brand").value;
    var model = document.getElementById("model").value;
    var category = document.getElementById("type").value;
    var fuel = document.getElementById("fuel").value;
    var color = document.getElementById("color").value;
    var price = document.getElementById("myRange").value;   

    if(brand === "-- brand --") {
        var url = `http://127.0.0.1:8000/cars&price=${price}`
    } else if(brand !== "-- brand --" && model === "-- model --") {
        var url = `http://127.0.0.1:8000/cars?brand=${brand}&price=${price}`
    } else if(brand !== "-- brand --" && model !== "-- model --" && 
                category === "-- type --" && fuel === "-- fuel --" &&
                color === "-- color --") {
        var url = `http://127.0.0.1:8000/cars?brand=${brand}&model=${model}&price=${price}`
    } else if(brand !== "-- brand --" && model !== "-- model --" && 
                category !== "-- type --" && fuel !== "-- fuel --" &&
                color !== "-- color --"){
        var url = `http://127.0.0.1:8000/cars?brand=${brand}&model=${model}&category=${category}&fuel=${fuel}&color=${color}&price=${price}`;
    }

    console.log(url);
    return url;
}


async function GetCars(url) {
    let response_cars = await fetch(`${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let first_result = await response_cars.json();
    let result_cars = first_result.data;

    let response_rental_deal = await fetch(`http://127.0.0.1:8000/rental_deal/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
       
    });
    let sec_result = await response_rental_deal.json();
    let result_rental_deal = sec_result;

    var rental_deal_ids = [];
    console.log(result_rental_deal);

    for (let item of result_rental_deal.data){
        rental_deal_ids.push(item.car_id);
    }

    var ul = document.querySelector(".search-content__list");
    ul.innerHTML = "";

    var cars_count = 0;

    for (let item of result_cars){

        if(rental_deal_ids.includes(item.id) || item.hasOwnProperty('message')) { continue; }

        var li = document.createElement("li");
        li.setAttribute("class", "search-list__item");

        var div1 = document.createElement("div");
        div1.setAttribute("class", "item__img-wrap");
        var a = document.createElement("a");
        a.setAttribute("class", "item__img-hover");
        var img = document.createElement("img");
        img.setAttribute("class", "car_image");
        img.setAttribute("id", "car-image-" + `${item.id}`);
        img.setAttribute("src", `${item.first_image_url}`);
        img.setAttribute("alt", "Car photo");
        a.appendChild(img);
        div1.appendChild(a);
        li.appendChild(div1);

        var div2 = document.createElement("div");
        div2.setAttribute("class", "item__descr-wrap");
        var p1 = document.createElement("p");
        p1.setAttribute("class", "descr-wrap__title");
        p1.innerHTML = `${item.brand}` + " " + `${item.model}`;
        var p2 = document.createElement("p");
        p2.setAttribute("class", "descr-wrap__sub");
        p2.innerHTML = `${item.description}`;
        var p3 = document.createElement("p");
        p3.setAttribute("class", "descr-wrap__price");
        p3.innerHTML = `${item.day_price}` + "$";
        div2.appendChild(p1);
        div2.appendChild(p2);
        div2.appendChild(p3);
        li.appendChild(div2);

        ul.appendChild(li);
        cars_count++;
    }

    SetCarsCount(cars_count);

    const carImages = document.querySelectorAll('.car_image');

    for (var carImage of carImages) {
        carImage.addEventListener('click', function(event) {
            event.preventDefault();
            ShowCar(this.id);
        });    
    }
}

await GetCars('http://127.0.0.1:8000/cars');


function ShowCar(carImageId) {
    console.log(carImageId);
    var car_id = carImageId.substring(10);
    localStorage.setItem("car_id", car_id);
    window.location.href = "car.html";
}
