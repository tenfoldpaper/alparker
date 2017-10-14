var map;
var markers = [];

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.3851, lng: 2.1734},
    zoom: 14,
    mapTypeId:'roadmap',
    styles: [
      {
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]

  });

  var cars = []; 
 
  var directionsService = new google.maps.DirectionsService(); 

  //Places a car at position 
  function placeCar(position){ 
    var car = new google.maps.Marker({ 
      position: position, 
      icon: './images/caricon.png', 
      clickable: false, 
      map: map 
    }); 
    car.path = []; 
    car.assignTime = 0; 
    car.fakeJamsChecked = 0; 
    car.jamsChecked = 0; 
    car.startPosition = car.position; 
    car.jams = []; 
    car.waypoints = []; 
    car.totalDistance = 0; 
    car.pointOnPath = 0; 

    car.target = new google.maps.LatLng(41.390673, 2.165964); 
    directionsService.route({ 
        origin:car.getPosition(), 
        destination:new google.maps.LatLng(41.390673, 2.165964), 
        travelMode: google.maps.TravelMode.DRIVING 
      }, function(result, status) { 
        if (status == google.maps.DirectionsStatus.OK) { 
          car.path = result.routes[0].overview_path; 
          car.pointOnPath = 0; 
        } 
      } 
    ); 

    cars.push(car); 

  } 

  //Returns a random point within the area defined bottomLeft and topRight 
  function randomPoint(bottomLeft, topRight){ 
    var latDiff = topRight.lat() - bottomLeft.lat(); 
    var lngDiff = topRight.lng() - bottomLeft.lng(); 
    var newLat = bottomLeft.lat() + Math.random() * latDiff; 
    var newLng = bottomLeft.lng() + Math.random() * lngDiff; 
    return new google.maps.LatLng(newLat, newLng); 
  } 

  //Place cars at random position in latlng range and drive them to location 
  var car_number = 2; 
  for(var i = 0; i<car_number; i++){ 
      var rPoint = randomPoint(new google.maps.LatLng(41.390593, 2.169290), new google.maps.LatLng(41.389997, 2.161394)); 
      directionsService.route({ 
      origin:rPoint, 
      destination:new google.maps.LatLng(41.390673, 2.165964), 
      travelMode: google.maps.TravelMode.DRIVING 
    }, function(result, status) { 
      if (status == google.maps.DirectionsStatus.OK) { 
        placeCar(new google.maps.LatLng(result.routes[0].legs[0].start_location.lat(), result.routes[0].legs[0].start_location.lng())); 
      }else{ 
        alert("Error: Google Maps API not returning location data. The app will restart."); 
        window.location = "./"; 
      } 
    }); 
  } 

  //Relocates car to position 
  function moveCar(car, position){ 
    car.setPosition(position); 
  } 

  //Moves a car along its path at the correct speed 
  function advance(car){ 
    car.pointOnPath++; 
    if(car.pointOnPath<car.path.length){ 
      moveCar(car, car.path[car.pointOnPath]); 
    }         
  } 

  setTimeout(function() { 
    timer = setInterval(function(){ 
      for(var f = 0; f<car_number;f++){ 
        advance(cars[f]); 
      } 
    }, 1000); 
  }, 2000);   
}

var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
});

