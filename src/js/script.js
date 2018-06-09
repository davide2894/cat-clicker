// parse clicktracker value to int
// increment it by 1
// update clicktracker string value
let catList = document.querySelector('ul').getElementsByTagName('li');
let catArea = document.getElementById('cat');
let clickTracker = document.getElementById('clickTracker');
let caption = document.getElementById('caption');
let catAreaImg = document.getElementById('cat-img');

//let num = parseInt(clickTracker.innerHTML);
let pattern = /^[(images)-{jpg|png|webp|gif}.]+/i;
let thisCat;
let arr = [];
// When click on cat in cat-list
for (catItem of catList){
	
	arr.push(catItem);
		
	let currentCatItem = catItem;
	
	
	catItem.addEventListener('click', function(){	
		
		let n = parseInt(currentCatItem.querySelectorAll('span')[1].innerHTML);
		
		localStorage.getItem('clicks');
		
		// take its img src
		catAreaImg.src = currentCatItem.querySelector('img').src;
		// console.log(catAreaImg)
		
		//give cat area the clicked cat's name
		caption.innerHTML = currentCatItem.querySelector('span').innerHTML;
		
		clickTracker.innerHTML = n.toString();
		
		localStorage.setItem('clicks', clickTracker.innerHTML)
				
		// store clicks;
		thisCat = currentCatItem;
	})	
}


catArea.addEventListener('click', function(){
	// updated cat in area 
	clickTracker.innerHTML = (parseInt(clickTracker.innerHTML) + 1).toString();
	
	// update cat in cat list too
	thisCat.querySelectorAll('span')[1].innerHTML = clickTracker.innerHTML;

	console.log(thisCat);
})
