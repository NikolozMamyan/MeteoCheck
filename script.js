const current = document.getElementById('current');
const city = document.getElementById('city');
const detailDiv = document.createElement("div");
const buttonDetail = document.getElementById('buttonDetail');
const cardMeteo = document.getElementById('cardMeteo');

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('.checkbox');

    toggleSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('container_b');
        } else {
            document.body.classList.remove('container_b');
        }
    });
});

let startX, startY;
let isMouseDown = false;

function startDrag(e) {
    startX = e.clientX - cardMeteo.offsetLeft;
    startY = e.clientY - cardMeteo.offsetTop;
    isMouseDown = true;
}

function drag(e) {
    if (isMouseDown) {
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        cardMeteo.style.left = newX + 'px';
        cardMeteo.style.top = newY + 'px';
    }
}

function stopDrag() {
    isMouseDown = false;
}

cardMeteo.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

cardMeteo.addEventListener('touchstart', function(e) {
    startDrag(e.touches[0]);
});
document.addEventListener('touchmove', function(e) {
    drag(e.touches[0]);
});
document.addEventListener('touchend', stopDrag);

let dateCurrent;

function updateClock() {
    let dateFR = new Date();
    dateCurrent = dateFR.toLocaleString('fr-FR', {
        hour: 'numeric',
        minute: 'numeric',
        weekday: 'long',
    });
    current.textContent = dateCurrent;
}

function refreshWeather(cityName) {
    updateClock();
    const apiUrl = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`;

    makeRequest(apiUrl, 'GET', function(data) {
        console.log(data);

        function currentWeather(data) {
            current.innerHTML = `${data.current.temp_c} º`;
        }

        function locationFun(data) {
            city.innerHTML = `${data.location.country}, ${data.location.name}`;
        }

        let isDetailVisible = false;

        function buttonWeather(data) {
            buttonDetail.addEventListener('click', (e) => {
                e.preventDefault();

                if (isDetailVisible) {
                    detailDiv.innerHTML = '';
                    detailDiv.classList.remove("detailWeather");
                    isDetailVisible = false;
                    buttonDetail.innerHTML = '+ d\'info <span></span>';
                } else {
                    detailDiv.innerHTML = `Humidité ${data.current.humidity} % <br> Vent ${data.current.wind_kph} km/h <br> ${dateCurrent}`;
                    buttonDetail.insertAdjacentElement("afterend", detailDiv);
                    detailDiv.classList.add("detailWeather");
                    isDetailVisible = true;
                    buttonDetail.innerHTML = '- info <span></span>';
                }
            });
        }

        currentWeather(data);
        locationFun(data);
        buttonWeather(data);
    });
}

function makeRequest(url, method, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('X-RapidAPI-Key', '55bade5a97mshf1cc7d41dfad008p19123ejsn0e2542b62278');
    xhr.setRequestHeader('X-RapidAPI-Host', 'weatherapi-com.p.rapidapi.com');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                callback(response);
            } else {
                console.error('Une erreur est survenue lors de la requête : ' + xhr.status);
            }
        }
    };
    xhr.send();
}

const searchInput = document.querySelector('.input');
searchInput.addEventListener('input', function() {
    const cityName = searchInput.value.trim(); 
    if (cityName) {
        refreshWeather(cityName);
    }
});

setInterval(() => {
    const cityName = searchInput.value.trim();
    if (cityName) {
        refreshWeather(cityName);
    }
}, 30000);

refreshWeather('Strasbourg');
