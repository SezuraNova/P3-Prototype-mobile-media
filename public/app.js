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
				var ID = (user.displayName + "-" +user.email  )
				var Name = user.displayName;
				var Email = user.email;
				const database = firebase.firestore();
				database.collection("Users").doc(String(ID)).set({
				    name: String(Name),
				    email: String(Email),
				})
				.then(function() {
				    console.log("User Document successfully written!");
				})
				.catch(function(error) {
				    console.error("Error writing document: ", error);
				});
				database.collection("Friends").doc(String(ID)).set({
				    FriendsOfUser: String(Name),
				    //email: String(Email),
				})
				.then(function() {
				    console.log("Friends Document successfully written!");
				})
				.catch(function(error) {
				    console.error("Error writing document: ", error);
				});
				console.log(user);
				var ThisUser = database.collection('Users').doc(String(ID));
				ThisUser.onSnapshot(doc =>{

				const data = doc.data();
				document.querySelector( "#Google").innerHTML = ("Hello " + data.name + " " + data.email);
				
			})
			})
			//.catch(console.log)
}

function addUserDocument() {
// Add a new document in collection "users"
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
	    console.error("Error writing document: ", error);
});
}

function addEventDocument() {
// Add a new document in collection "events"
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
	    console.error("Error writing document: ", error);
});
}