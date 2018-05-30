var GoogleID = "blank";
var geocoder;
var map;
var latitude;
var longitude;

document.addEventListener("DOMContentLoaded" , event => {

	const app = firebase.app();
	// console.log(app)
	const database = firebase.firestore();
  	const settings = {/* your settings... */ timestampsInSnapshots: true};
  	database.settings(settings);
	

	const myUser = database.collection('Users').doc('ONE');

	myUser.onSnapshot(doc =>{

				const data = doc.data();
				document.querySelector( "#Name").innerHTML = data.Name
				
			})

});

function updatePost (event){

	const database = firebase.firestore();
	const myUser = database.collection('Users').doc('ONE');
	myUser.update({ Name: event.target.value })


}

function googleLogin() {

	const provider = new firebase.auth.GoogleAuthProvider();
	

	firebase.auth().signInWithPopup(provider)

			.then(result =>{
				const user = result.user;
				//document.write ("Hello ");
				// Add a new document in collection "users"
				GoogleID = (user.displayName + "-" +user.email  )
				var Name = user.displayName;
				var Email = user.email;
				hide("EventForm");
				hide("UserForm");
				hide("Name");
				hide("FriendForm");
				hide("update");
				hide("Google");
				hide("Controls");
				hide("addEventLocation");
				myMap();
				
				const database = firebase.firestore();
				database.collection("Users").doc(String(GoogleID)).set({
				    name: String(Name),
				    email: String(Email),
				})
				.then(function() {

				    console.log("User Document successfully written!");
				})
				.catch(function(error) {
				    console.error("Error writing User document: ", error);
				});
				// database.collection("Friends").doc(String(GoogleID)).set({
				//     //FriendsOfUser: String(Name),
				//     //email: String(Email),
				// })
				// .then(function() {
				//     console.log("Friends Document successfully written!");
				// })
				// .catch(function(error) {
				//     console.error("Error writing Friends document: ", error);
				// });
				console.log(user);
				var ThisUser = database.collection('Users').doc(String(GoogleID));
				ThisUser.onSnapshot(doc =>{
				//document.getElementById("EventForm").style.display = "none";	
				const data = doc.data();
				document.querySelector( "#Google").innerHTML = ("Hello " + data.name);

				
			})
			})
			//.catch(console.log)
}

function addUserDocument() {
	// Add a new document in collection "Users"
	var ID = document.getElementById('UserID').value
	var Name = document.getElementById('UserName').value
	var Email = document.getElementById('UserEmail').value
	const database = firebase.firestore();
	database.collection("Users").doc(String(ID)).set({
	    name: String(Name),
	    email: String(Email),
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Users document: ", error);
});
}

function addEventDocument() {
	// Add a new document in collection "Events"
	var ID = document.getElementById('EventID').value
	var Name = document.getElementById('EventName').value
	var Location = document.getElementById('EventLocation').value
	const database = firebase.firestore();
	database.collection("Events").doc(String(ID)).set({
	    name: String(Name),
	    Location: String(Location),
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Events document: ", error);
});
}

function addFriendDocument() {
	// Add a new document in collection "Friends"
	var Name = document.getElementById('FriendName').value
	var Email = document.getElementById('FriendEmail').value
	Name = String(Name);
	Email = String(Email);
	var NameEmail = "Friendslist." + Name + "-" + Email;
	Friendslist = {

	}
	const database = firebase.firestore();
	database.collection("Friends").doc(String(GoogleID)).update({	     
	    	[NameEmail] : true,
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Friends document: ", error);
});
}

function hide(myDIV) {
	myDIV = String(myDIV);
	//console.log(myDIV);
    var x = document.getElementById(myDIV);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function myMap() {
	geocoder = new google.maps.Geocoder();
    var Location = new google.maps.LatLng(-41.2, 174.7)
    var mapOptions = {
        center: Location,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	const database = firebase.firestore();
	console.log("Started");
	database.collection("Events")//.where("Location", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var myLatLng = {lat: doc.data().Location._lat, lng: doc.data().Location._long};
            var marker = new google.maps.Marker({
			    map: map,
			    draggable: false,
			    position: myLatLng,
			    label: doc.data().name,
			    title: doc.data().name

			});
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function codeAddress() {
var address = document.getElementById("address").value;
geocoder.geocode( { 'address': address}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
map.setCenter(results[0].geometry.location);

var marker = new google.maps.Marker({
    map: map,
    draggable: true,
    position: results[0].geometry.location

});
   google.maps.event.addListener(marker, 'dragend', function(evt){
   document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' 
   + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
   
   	latitude = evt.latLng.lat().toFixed(6);
   	longitude = evt.latLng.lng().toFixed(6);
   	console.log(latitude + " " + longitude)
   	var input = latitude + ", " + longitude;
	var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
          	if (status === 'OK') {
	          	if (results[0]) {
	    			document.getElementById('info').innerHTML = '<p>Address:  ' + results[0].formatted_address + '</p>';
	    		} else {
	              window.alert('No results found');
	            }
			} else {
            window.alert('Geocoder failed due to: ' + status);
          }
    });      

   });

   google.maps.event.addListener(marker, 'dragstart', function(evt){
   document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
   });

   // google.maps.event.addListener(marker, 'dragend', function(evt){
   document.getElementById('info').innerHTML = '<p>Address:  ' + results[0].formatted_address + '</p>';
   // });

   google.maps.event.addListener(marker, 'dragstart', function(evt){
   document.getElementById('info').innerHTML = '<p>Currently dragging marker...</p>';
   });



 map.setCenter(marker.position);
 marker.setMap(map);

  } else {
    alert("Geocode was not successful for the following reason: " + status);
    }
     });
}

function addEventMapDocument() {
	// Add a new document in collection "Events"
	var Name = document.getElementById('EventNameMap').value
	var loc = new firebase.firestore.GeoPoint(Number(latitude),Number(longitude));
	console.log(loc);
	const database = firebase.firestore();
	database.collection("Events").add({
	    name: String(Name),
	    Location: loc,
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Events document: ", error);
});
}