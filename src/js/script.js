// parse clicktracker value to int
// increment it by 1
// update clicktracker string value

let catOne = document.getElementById('clickTrackerOne');
let catTwo = document.getElementById('clickTrackerTwo');

let num1 = parseInt(catOne.innerHTML);
let num2 = parseInt(catTwo.innerHTML);

function incrementCatOne(){
	num1 = num1+1;
	catOne.innerHTML = num1.toString();
}

function incrementCatTwo(){
	num2 = num2+1;
	catTwo.innerHTML = num2.toString();
}