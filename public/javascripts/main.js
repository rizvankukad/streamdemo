$(document).ready(function(){

	var music = $('#music');
	var duration;
	var pButton = $('#pButton');

	var playhead = $('#playhead');

	var timeline = $('#timeline');

	// timeline width adjusted for playhead
	var timelineWidth = timeline.get(0).offsetWidth - playhead.get(0).offsetWidth;

	// timeupdate event listener
	music.on("timeupdate", timeUpdate);

	//Makes timeline clickable
	timeline.on("click", function (event) {
		moveplayhead(event);
		music.get(0).currentTime = duration * clickPercent(event);
	});

	// returns click as decimal (.77) of the total timelineWidth
	function clickPercent(event) {
		return (event.pageX - timeline.get(0).offsetLeft) / timelineWidth;
	}

	// Makes playhead draggable 
	playhead.on('mousedown', mouseDown);
	$(window).on('mouseup', mouseUp);

	// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
	var onplayhead = false;
	// mouseDown EventListener
	function mouseDown() {
		onplayhead = true;
		window.on('mousemove', moveplayhead);
		music.off('timeupdate', timeUpdate);
	}
	// mouseUp EventListener
	// getting input from all mouse clicks
	function mouseUp(e) {
		if (onplayhead == true) {
			moveplayhead(e);
			window.off('mousemove', moveplayhead);
			// change current time
			music.get(0).currentTime = duration * clickPercent(e);
			music.on('timeupdate', timeUpdate);
		}
		onplayhead = false;
	}
	// mousemove EventListener
	// Moves playhead as user drags
	function moveplayhead(e) {
		var newMargLeft = e.pageX - timeline.get(0).offsetLeft;
		if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
			playhead.get(0).style.marginLeft = newMargLeft + "px";
		}
		if (newMargLeft < 0) {
			playhead.get(0).style.marginLeft = "0px";
		}
		if (newMargLeft > timelineWidth) {
			playhead.get(0).style.marginLeft = timelineWidth + "px";
		}
	}

	// timeUpdate 
	// Synchronizes playhead position with current point in audio 
	function timeUpdate() {
		var playPercent = timelineWidth * (music.get(0).currentTime / duration);
		playhead.get(0).style.marginLeft = playPercent + "px";
		if (music.get(0).currentTime == duration) {
			pButton.className = "";
			pButton.className = "play";
		}
	}

	function play() {
		// start music
		if (music.get(0).paused) {
			music.get(0).play();
			// remove play, add pause
			pButton.get(0).className = "";
			pButton.get(0).className = "pause";
		} else { // pause music
			music.get(0).pause();
			// remove pause, add play
			pButton.get(0).className = "";
			pButton.get(0).className = "play";
		}
	}

	//Play and Pause
	pButton.on('click', play);
	

	// Gets audio file duration
	music.get(0).addEventListener("canplaythrough", function () {
		duration = music.get(0).duration;
		console.log('duration : ' + duration );
	}, false);
});
	
