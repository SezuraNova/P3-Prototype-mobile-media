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
				document.write ("Hello " + user.displayName);
				console.log(user)
			})
			.catch(console.log)
}

function addUserDocument() {
// Add a new document in collection "cities"
	var ID = document.getElementById('UserID').value
	var Name = document.getElementById('UserName').value
	var Email = document.getElementById('USerEmail').value
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
// Add a new document in collection "cities"
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