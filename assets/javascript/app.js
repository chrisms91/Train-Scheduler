// Initialize Firebase
var config = {
    apiKey: "AIzaSyAeuNU__udzlfqEDzdjl4aPWWZBuou7AjI",
    authDomain: "train-scheduler-a7a90.firebaseapp.com",
    databaseURL: "https://train-scheduler-a7a90.firebaseio.com",
    projectId: "train-scheduler-a7a90",
    storageBucket: "",
    messagingSenderId: "832309823771"
  };

firebase.initializeApp(config);

var database = firebase.database();

$('#submit').on('click', function(event) {

	event.preventDefault();

	var trainName = $('#train-name').val().trim();
	var trainDestination = $('#train-destination').val().trim();
	var trainFirstTime = moment($('#train-first-time').val().trim(), 'HH:mm');
	var trainFrequency = $('#train-frequency').val();

	var nextArrival;
	var minutesAway;

	console.log(trainName + "  " + trainDestination + "  " + trainFirstTime + "  " + trainFrequency);


	
})