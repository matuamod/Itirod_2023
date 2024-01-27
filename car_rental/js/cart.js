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

    const cars = await response.json();
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
    preview.innerHTML = `You can choose one of ${count} cars which you rent here`;
}



function ConfigureUrl() {
    var brand = document.getElementById("brand").value;
    var model = document.getElementById("model").value;
    var category = document.getElementById("type").value;
    var fuel = document.getElementById("fuel").value;
    var color = document.getElementById("color").value;
    var price = document.getElementById("myRange").value;   

    if(brand === "-- brand --") {
        var url = `http://127.0.0.1:8000/rental_deal/${localStorage.getItem("user_id")}&price=${price}`
    } else if(brand !== "-- brand --" && model === "-- model --") {
        var url = `http://127.0.0.1:8000/rental_deal/${localStorage.getItem("user_id")}?brand=${brand}&price=${price}`
    } else if(brand !== "-- brand --" && model !== "-- model --" && 
                category === "-- type --" && fuel === "-- fuel --" &&
                color === "-- color --") {
        var url = `http://127.0.0.1:8000/rental_deal/${localStorage.getItem("user_id")}?brand=${brand}&model=${model}&price=${price}`
    } else if(brand !== "-- brand --" && model !== "-- model --" && 
                category !== "-- type --" && fuel !== "-- fuel --" &&
                color !== "-- color --"){
        var url = `http://127.0.0.1:8000/rental_deal/${localStorage.getItem("user_id")}?brand=${brand}&model=${model}&category=${category}&fuel=${fuel}&color=${color}&price=${price}`;
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
    let result_cars = await response_cars.json();
    console.log(result_cars);
    
    var ul = document.querySelector(".search-content__list");
    ul.innerHTML = "";

    var cars_count = 0;

    for (let item of result_cars){
        if(item.hasOwnProperty('message')){ continue; }

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
        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "delete-button");
        deleteButton.setAttribute("id", `delete-button-${item.id}`);
        deleteButton.innerHTML = "Stop Rent";
        deleteButton.style.margin = "10px"
        deleteButton.style.marginLeft = "30px"
        deleteButton.style.padding = "5px"
        deleteButton.style.borderRadius = "10px"
        deleteButton.style.backgroundColor = "red";
        deleteButton.style.color = "white";
        p3.append(deleteButton);
        div2.appendChild(p1);
        div2.appendChild(p2);
        div2.appendChild(p3);
        li.appendChild(div2);

        ul.appendChild(li);
        cars_count++;
    }

    SetCarsCount(cars_count);
}

await GetCars(`http://127.0.0.1:8000/rental_deal/${localStorage.getItem("user_id")}`);


async function DeleteRentalDeal(carDeleteId) {
    var car_id = carDeleteId.substring(14);

    var confirmDelete = window.confirm("Are you sure you want to complete your lease?");
    
    if(confirmDelete) {
        fetch(`http://127.0.0.1:8000/rental_deal/${car_id}`, {
        method: 'DELETE',
        })
        .then(response => response.text()) 
        .then(response => console.log(response))

        location.reload();
    } else {
        console.log("Passed");
    }
}


const deleteButtons = document.querySelectorAll(".delete-button");

for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await DeleteRentalDeal(this.id);
    });
}

