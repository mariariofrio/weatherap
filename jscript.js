const APIKEY = '2341174992ef15f8815d760242c3e462';
localStorage.setItem('weatherApp',JSON.stringify([]) )

var searchhistory =JSON.parse(localStorage.getItem("weatherApp"))
console.log(searchhistory)
var city;
if(searchhistory[0]){
    console.log("there was a history")
    city=searchhistory[0]
    searchhistory.forEach(function(oldcity){
        let $city= $("<p>").text(oldcity.city)
        $('#list').append($city)
    })
 }else{
     city="atlanta"
    }

$("#list p").on("click", function(){
    var cityValue = $(this).text();
    getWeather(cityValue);
    // TODO
    // Store the text value into a variable
    // Run an ajax with the value the text to get the new weather

})
console.log(city)
getWeather(city.city)
function getWeather(city){
$.get(
`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=imperial`,
{headers: {
    "X-Requested-With":"XMLHttpRequest"
}}
).then(function(response){
    console.log("NOW",response)
    var temp = response.main.temp;
    $('#temp').text(temp)
    $("#city").text(response.name)
    var day = moment(response.dt, "X");
    $("#date").text(day.format("MMM/D/YYYY"))
    $("#humd").text(response.main.humidity)
    $("#wspd").text(response.wind.speed)
    var lat= response.coord.lat
    var lon= response.coord.lon
    $.get(
        `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`
    ).then(function(uvResponse){
    $('#uvindex').text(uvResponse.value)
    })

})

$.get(
`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=imperial`,
{headers: {
    "X-Requested-With":"XMLHttpRequest"
}}
).then(function(response){
    console.log(response)
    $('#forecast').empty()
    for(let i=7;i<response.list.length;i+=8){
        var forecast= response.list[i]
    var day = moment(forecast.dt, "X");
    let $card= $('<div class="col-2 p-3 my-3 bg-info">')
    let $date= $("<p>").text(day.format("MMM/D/YYYY"))
    var temp = (forecast.main.temp);
    let $temp= $("<p>").text(`Temp: ${temp}`)
    var humidity = (forecast.main.humidity);
    let $humidity= $("<p>").text(`humidity: ${humidity}`)
    var icon = (forecast.weather[0].icon);
    let  $icon= $("<img>").attr("src",`http://openweathermap.org/img/wn/${icon}@2x.png`)
    $card
        .append($date)
        .append($icon)
        .append($temp)
        .append($humidity)
     
    $('#forecast').append($card)
    }
})
}
$("#search").on("click", function(event){
    event.preventDefault()
    var input = $('#input').val()
    let oldStorage= JSON.parse(localStorage.getItem("weatherApp"))
    //if (!oldStorage.selected(input)) {
        console.log("outside",oldStorage)
    if (oldStorage) {
        console.log("inside",oldStorage)
        oldStorage.unshift({city:input})
        if (oldStorage.length > 10 ){
            oldStorage.pop()
        }
        localStorage.setItem("weatherApp", JSON.stringify(oldStorage))
    }else{
        console.log("Good thing we have the local storage got deleted case/ the default case")
        localStorage.setItem("weatherApp", JSON.stringify([{city:input}]))       
    }
    city=input
    getWeather(input)
    console.log(input)
})
