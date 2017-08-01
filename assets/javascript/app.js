
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
var ref = database.ref();

//currTime in military time
var currentTime = moment().format('HH:mm');
var keyArray = [];

// Update table
ref.on('child_added', function(snap) {

	var trains = snap.val();
	keyArray.push(snap.key);

	//update table
	$('#train-schedule').append(
	  	'<tr class="train-info" data-key="' + snap.key + '">' + 
	  		'<td>' + '<span id="trainName">' + trains.name + '</span></td>' + 
	  		'<td>' + '<span id="trainDestination">' + trains.destination + '</span></td>' +
	  		'<td>' + '<span id="trainFrequency">' + trains.frequency + '</span></td>' +
	  		'<td>' + '<span id="trainNextArrival">' + trains.nextArrival + '</span></td>' +
	  		'<td>' + '<span id="trainMinutesAway">' + trains.minutesAway + '</span> <span class="pull-right remove" data-key="' + snap.key + '"><i class="glyphicon glyphicon-remove"></i></span> </td>' +
	  	'</tr>'
 	);

});

// function that calculates next arrival time and minutes away
function predictTrainTime(firstTime, frequency) {

	var tFreq = frequency;
	var tFirst = firstTime;

	//push back 1 year to make sure it comes before current time
	var tFirstConverted = moment(tFirst, "hh:mm").subtract(1, 'years');

	//get difference btw currenttime and first train time
	var tDiff = moment().diff(moment(tFirstConverted), "minutes");

	var tRemainder = tDiff % tFreq;

	var tMinutesAway = tFreq - tRemainder;

	var nextTrain = moment().add(tMinutesAway, 'minutes');
	// console.log("arrival time: " + moment(nextTrain).format('hh:mm A'));

	//save in array to return multiple values
	return [tMinutesAway, nextTrain];

}

function updateTime() {

	var currTime = moment().format('HH:mm A');
	$('#current-time').html(currTime);


	ref.on('child_added', function(snap) {

		var trains = snap.val();

		//calculate new times based on currTime
		var newPredictTime = predictTrainTime(trains.firstTime, trains.frequency);
		var newArrival = moment(newPredictTime[1]).format('hh:mm A');
		var newMinutes = newPredictTime[0];

		//update database
		ref.child(snap.key).update({
			"minutesAway": newMinutes,
			"nextArrival": newArrival
		});

		//update html
		$('[data-key="'+snap.key+'"]').find('#trainMinutesAway').html(newMinutes);
		$('[data-key="'+snap.key+'"]').find('#trainNextArrival').html(newArrival);

	})

}


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

	ref.push({

		name: trainName,
		destination: trainDestination,
		frequency: trainFrequency,
		nextArrival: nextArrival,
		minutesAway: minutesAway,
		firstTime: trainFirstTime

	});

	//clear form values after submit
	$('form').trigger("reset");

});

//panel collapse
$(document).on('click', '.panel-heading span.clickable', function(event){

    var $this = $(this);

	if(!$this.hasClass('panel-collapsed')) {

		$this.parents('.panel').find('.panel-body').slideUp();
		$this.addClass('panel-collapsed');
		$this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

	} else {

		$this.parents('.panel').find('.panel-body').slideDown();
		$this.removeClass('panel-collapsed');
		$this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

	}

});

//Remove button
$(document).on('click', '.remove', function(event) {

	event.preventDefault();

	var key = $(this).attr('data-key');

	//remove from database
	ref.child(key).remove();

	var $row = $('#train-schedule').find('[data-key="'+key+'"]');
	$row.empty();

});

$('#pageDown').on('click', function(e) {

	e.preventDefault();

    $('html, body').animate({
        scrollTop: $("#schedule").offset().top
    }, 1500);
})



updateTime();
setInterval(updateTime, 1000);

var s = skrollr.init();


