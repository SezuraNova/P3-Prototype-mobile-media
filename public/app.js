var UserID = "blank";
var geocoder;
var map;
var latitude;
var longitude;
var EventsArray = [];

document.addEventListener("DOMContentLoaded" , event => {

	const app = firebase.app();
	// console.log(app)
	const database = firebase.firestore();
  	const settings = {/* your settings... */ timestampsInSnapshots: true};
  	database.settings(settings);
	

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    var UserID = user.displayName + "-" + user.email;
	  } else {
	    // No user is signed in.
	    var UserID = "blank";
	  }
	  console.log(UserID);
	});

	// const myUser = database.collection('Users').doc('ONE');

	// myUser.onSnapshot(doc =>{

	// 			const data = doc.data();
	// 			document.querySelector( "#Name").innerHTML = data.Name
				
	// 		})

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
			UserID = (user.displayName + "-" +user.email  )
			var Name = user.displayName;
			var Email = user.email;
			HideStuffOnLogin();
			const database = firebase.firestore();
			database.collection("Users").doc(String(UserID)).get().then(function(doc) {
				if (doc.exists) {
			        console.log("Document data:", doc.data());
			        console.log("here 1");
			      	
			      	// database.collection("Users").doc(String(UserID)).get(RSVPs).then(function(doc) {
			      	// 	 console.log("Document data:", doc.data());
			      	// })
			      	//   var ref = String(UserID) + ".RSVPs"
			     	// database.collection("Users").doc(ref).get()
			     	// .then(function(doc) {
			     	// 	console.log(doc.data)
			     	// })

			     	// database.collection('Users').doc(String(UserID))
				    // .where('RSVPs', '==', true)
				    // .get()
				    // .then((doc) => {
				    //     console.log(doc.data());
				    // });

			       	//  var RSVPs = doc.data().RSVPs;
			       	//  console.log(RSVPs.size);
	        		//  	RSVPs.forEach(function(snapshot){
			        //  		var obj = snapshot.val();
	       			// 		if(obj == true) {
					    		// console.log(obj);
			       	//     	}
			        //  	})
	         		

			        // document.querySelector( "#Google").innerHTML = ("RSVPs " + RSVPs);
					
					// for (var [key, value] of doc.data()) {
					//   	console.log(key + ' = ' + value);
					// }
					// for (var [key, value] of RSVPs.entries()) {
					//   	console.log(key + ' = ' + value);
					// }
					// RSVPs.forEach(function(value, key) {
					//   	console.log(key + ' = ' + value);
					// });
					console.log("here 2");
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			        database.collection("Users").doc(String(UserID)).set({
					    name: String(Name),
					    email: String(Email),
					})
					.then(function() {

					    console.log("User Document successfully written!");
					})
					.catch(function(error) {
					    console.error("Error writing User document: ", error);
					});
			    }
			    }).catch(function(error) {
				    console.log("Error getting document:", error);
				});
			var ThisUser = database.collection('Users').doc(String(UserID));
			ThisUser.onSnapshot(doc =>{
				const data = doc.data();
				//document.querySelector( "#Google").innerHTML = ("Hello " + data.name);
				
				
			})
		})
			//.catch(console.log)
}

function addUserDocument(Create) {
	// Add a new document in collection "Users"
	var Name = document.getElementById('UserName').value;
	var Email = document.getElementById('UserEmail').value;
	Password = document.getElementById('Password').value;
	UserID = Name + "-" + Email;
	if(Create) {
		firebase.auth().createUserWithEmailAndPassword(Email, Password)

		.then(result =>{
			
			const database = firebase.firestore();
			database.collection("Users").doc(String(UserID)).get().then(function(doc) {
				if (doc.exists) {
			        console.log("Document exists");
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			        database.collection("Users").doc(String(UserID)).set({
					    name: String(Name),
					    email: String(Email),
					})
					.then(function() {

					    console.log("User Document successfully written!");
					})
					.catch(function(error) {
					    console.error("Error writing User document: ", error);
					});
			    }
			    }).catch(function(error) {
				    console.log("Error getting document:", error);
				});

			HideStuffOnLogin();
			var ThisUser = database.collection('Users').doc(String(UserID));
			ThisUser.onSnapshot(doc =>{
				const data = doc.data();
				document.querySelector( "#Google").innerHTML = ("Hello " + data.name);
				var RSVPs = data.RSVPs;
				for (var i = RSVPs.length - 1; i >= 0; i--) {
					console.log(RSVPs[i]);
				}
				

			})
		})

		.catch(function(error) {
		  	// Handle Errors here.
		  	var errorCode = error.code;
		  	var errorMessage = error.message;
		  	console.log("signup Errors =" +errorMessage + " " + errorCode)
		  	// ...
		});
	} else {
		firebase.auth().signInWithEmailAndPassword(Email, Password)
		.then(function(doc) {
			HideStuffOnLogin();
		})
		.catch(function(error) {
	  	// Handle Errors here.
	  	var errorCode = error.code;
	  	var errorMessage = error.message;
	  	console.log("signin Errors =" + errorMessage + " " + errorCode)
	  	// ...
		});
	}
	
	
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
	var Name = document.getElementById('FriendName').value;
	var Email = document.getElementById('FriendEmail').value;
	Name = String(Name);
	Email = String(Email);
	var NameEmail = "Friendslist." + Name + "-" + Email;
	Friendslist = {

	}
	const database = firebase.firestore();
	database.collection("Friends").doc(String(UserID)).update({	     
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

function HideStuffOnLogin(){
	hide("EventForm");
	hide("UserForm");
	hide("Name");
	hide("FriendForm");
	hide("update");
	hide("Controls");
	hide("addEventLocation");
	hide("GoogleButton");
	EventDropDown();
	myMap();
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
            //debug console.log(doc.id, " => ", doc.data());
            var ContentString = "<p>Event Name: " + doc.data().name + "</p><p>Event Description: "+ doc.data().Description 
            + "</p><p>Event Location: "+ doc.data().Location._lat + ", " + doc.data().Location._long + "</p><p>Event Time: "+ doc.data().Time + "</p>" 
            
            var infowindow = new google.maps.InfoWindow({
          		content: ContentString
        	});
            
            var myLatLng = {lat: doc.data().Location._lat, lng: doc.data().Location._long};
            var marker = new google.maps.Marker({
			    map: map,
			    draggable: false,
			    position: myLatLng,
			    label: doc.data().name,
			    title: doc.data().name

			});

			marker.addListener('click', function() {
          		infowindow.open(map, marker);
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
		   	// document.getElementById('info').innerHTML = '<p>Address:  ' + results[0].formatted_address + '</p>';
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

function EventDropDown() {
	var select = document.getElementById("SelectEvents"); 
	
	//console.log(EventsArray); 
	var Counter = 0;
	const database = firebase.firestore();
	//console.log("EventDDStarted");
	database.collection("Events")//.where("Location", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data().name);
            EventsArray[Counter] = doc.data().name;
            //console.log(EventsArray[Counter]);
            //console.log(EventsArray.length);            
            Counter ++;
		});
    })
    .then(function(){
    	for (var i = EventsArray.length - 1; i >= 0; i--) {
    	//console.log(EventsArray[i]);
	    }
	    //console.log("EventDDMidpoint");

		for(var i = 0; i < EventsArray.length; i++) {
		    var Evt = EventsArray[i];
		    var listItem = document.createElement("option");
		    listItem.textContent = Evt;
		    listItem.value = Evt;
		    select.appendChild(listItem);
		}
		//console.log("EventDDEndpoint");
    })	
    
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    
}

function addEventToUser(){

	var NameOfEvent = document.getElementById('SelectEvents').value;
	var RSVPEvent = "RSVPs." + NameOfEvent;
	const database = firebase.firestore();
	database.collection("Users").doc(String(UserID)).update({	     
	    	[RSVPEvent] : true,
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Friends document: ", error);
	});
}

function RSVPList () {

	const database = firebase.firestore();	
}