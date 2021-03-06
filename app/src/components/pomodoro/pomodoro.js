/**
 * Created by tvaisanen, Christian Reiser on 11/13/17.
 */
// For testing purposes, 100 seconds = 1 day

var PomodoroState = {
  STOPPED: {ENUM: 1, style: ""},
  POMODORO: {ENUM: 2, style:+ ""},
  BREAK: {ENUM: 3}
};

var pomodoro_state = PomodoroState.STOPPED;
var pomodoro_time = 10; // 8 seconds
var break_time = 4; // 2 seconds
var pomodoro_start; // start in seconds of current pomodoro
var pomodoros = []; // [start, end, start, end, ...]
var debug_start;

function tick(pomState) {
	if (pomodoro_state != PomodoroState.STOPPED) {
		//console.log(get_rel_time());

		// first check if we have to go to a new state
		if (pomodoro_state == PomodoroState.POMODORO && get_rel_time() > pomodoro_start + pomodoro_time) {
			pomodoro_state = PomodoroState.BREAK;
			add_pomodoro();
		} else if (pomodoro_state == PomodoroState.BREAK && get_rel_time() > pomodoro_start + pomodoro_time + break_time) {
			pomodoro_state = PomodoroState.POMODORO;
			pomodoro_start = pomodoro_start + pomodoro_time + break_time;
		}

		// then update UI
		if (pomodoro_state == PomodoroState.POMODORO) {
		    document.getElementById('info').innerHTML = "Work! Next break in " + Math.round(pomodoro_start + pomodoro_time - get_rel_time()) + " seconds.";
		} else if (pomodoro_state == PomodoroState.BREAK) {
			document.getElementById('info').innerHTML = "Take a break! Next pomodoro in " + Math.round(pomodoro_start + pomodoro_time + break_time - get_rel_time()) + " seconds.";
		}

		var progress_html = "";
		// render overview bar
		// TODO: add offset in the beginning
		for (var i = 0; i < pomodoros.length; i += 2) {
			var width = pomodoros[i + 1] - pomodoros[i]; // 1% = 1 second
			progress_html += '<div style="width: ' + width + '%; height: 21px; background-color: green; float: left;"></div>';
			if (i + 2 < pomodoros.length) {
				width = pomodoros[i + 2] - pomodoros[i + 1];
				progress_html += '<div style="width: ' + width + '%; height: 21px; float: left;"></div>';
			}
		}
		// current active pomodoro will be updated continously
		if (pomodoro_state == PomodoroState.POMODORO) {
			if (pomodoros.length) {
				var width = pomodoro_start - pomodoros[pomodoros.length - 1];
				progress_html += '<div style="width: ' + width + '%; height: 21px; float: left;"></div>';
			}

			width = get_rel_time() - pomodoro_start;
			progress_html += '<div style="width: ' + width + '%; height: 21px; background-color: green; float: left;"></div>';
		}
		document.getElementById("progress").innerHTML = progress_html;

		setTimeout(tick, 10);
	}
}

function get_rel_time() {
	return new Date().getTime() / 1000 - debug_start;
}

function add_pomodoro() {
	pomodoros.push(pomodoro_start);
	pomodoros.push(get_rel_time());
	console.log(pomodoros);
}

window.onload = function() {
	debug_start = new Date().getTime() / 1000;

	document.getElementById("control").addEventListener("click", function() {
		if (pomodoro_state == PomodoroState.STOPPED) {
			pomodoro_state = PomodoroState.POMODORO;
			pomodoro_start = get_rel_time();
			document.getElementById("control").innerText = "Stop";
			tick();
		} else /* if (pomodoro_state == PomodoroState.POMODORO || pomodoro_state == PomodoroState.BREAK) */ {
			pomodoro_state = PomodoroState.STOPPED;
			document.getElementById("control").innerHTML = "Start";
			add_pomodoro();
		}
		//$("#info").text(pomodoro_state)
		return false;
	});
};