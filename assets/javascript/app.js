
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAeuNU__udzlfqEDzdjl4aPWWZBuou7AjI",
    authDomain: "train-scheduler-a7a90.firebaseapp.com",
    databaseURL: "https://train-scheduler-a7a90.firebaseio.com",
    projectId: "train-scheduler-a7a90",
    storageBucket: "train-scheduler-a7a90.appspot.com",
    messagingSenderId: "832309823771"
  };
firebase.initializeApp(config);

var database = firebase.database();

//currTime in military time
var currentTime = moment().format('HH:mm');

$('#submit').on('click', function(event) {

	event.preventDefault();

	var trainName = $('#train-name').val().trim();
	var trainDestination = $('#train-destination').val().trim();
	var trainFirstTime = $('#train-first-time').val().trim();
	var trainFrequency = $('#train-frequency').val().trim();

	var nextArrival;
	var minutesAway;

	var predictTime = predictTrainTime(trainFirstTime, trainFrequency);
	nextArrival = moment(predictTime[1]).format('hh:mm A');
	minutesAway = predictTime[0];

	console.log(nextArrival);
	console.log(minutesAway);

	database.ref().push({

		name: trainName,
		destination: trainDestination,
		frequency: trainFrequency,
		nextArrival: nextArrival,
		minutesAway: minutesAway,
		firstTime: trainFirstTime

	})

});

// function that calculates next arrival time and minutes away
function predictTrainTime(firstTime, frequency) {

	var tFreq = frequency;
	var tFirst = firstTime;

	//push back 1 year to make sure it comes before current time
	var tFirstConverted = moment(tFirst, "hh:mm").subtract(1, 'years');
	// console.log(tFirstConverted);

	var tDiff = moment().diff(moment(tFirstConverted), "minutes");
	// console.log(tDiff);

	var tRemainder = tDiff % tFreq;
	// console.log(tRemainder);

	var tMinutesAway = tFreq - tRemainder;
	// console.log(tMinutesAway);

	var nextTrain = moment().add(tMinutesAway, 'minutes');
	console.log("arrival time: " + moment(nextTrain).format('hh:mm A'));

	return [tMinutesAway, nextTrain];

}

database.ref().on('child_added', function(snap, prefChildKey) {

	var trains = snap.val();
	console.log(trains);

	//update table
	$('#train-schedule').append(
  	'<tr>' + 
  		'<td>' + '<span id="trainName">' + trains.name + '</span></td>' + 
  		'<td>' + '<span id="trainDestination">' + trains.destination + '</span></td>' +
  		'<td>' + '<span id="trainFrequency">' + trains.frequency + '</span></td>' +
  		'<td>' + '<span id="trainNextArrival">' + trains.nextArrival + '</span></td>' +
  		'<td>' + '<span id="trainMinutesAway">' + trains.minutesAway + '</span></td>' +
  	'</tr>'
  )
})




