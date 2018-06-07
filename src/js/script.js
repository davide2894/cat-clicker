// parse clicktracker value to int
// increment it by 1
// update clicktracker string value

let clickTracker = document.getElementById('clickTracker');

let n = parseInt(clickTracker.innerHTML);

function incrementByOne(){
	n = n+1;
	clickTracker.innerHTML = n.toString();
}

