var addFlashButton = document.getElementById('create-flash-button');

addFlashButton.addEventListener('click', openAddflash);

function openAddflash() {
   var modalBackdrop = document.getElementById('modal-backdrop');
   var modal = document.getElementById('create-flash-modal');
   modalBackdrop.classList.remove('hidden');
   modal.classList.remove('hidden');
}

var closeModalButton = document.getElementsByClassName('modal-close-button')[0];

closeModalButton.addEventListener('click', closeModal);

function closeModal(){
   var flashFront = document.getElementById('flash-word-input');
   var flashBack = document.getElementById('flash-desc-input');
   flashFront.value = '';
   flashBack.value = '';
   var modalBackdrop = document.getElementById('modal-backdrop');
   var modal = document.getElementById('create-flash-modal');
   modalBackdrop.classList.add('hidden');
   modal.classList.add('hidden');
}

var cancelModalButton = document.getElementsByClassName('modal-cancel-button')[0];

cancelModalButton.addEventListener('click', closeModal);

var acceptModalButton = document.getElementsByClassName('modal-accept-button')[0];

acceptModalButton.addEventListener('click', addflash);

function addflash(){
   var frontInput = document.getElementById('flash-word-input').value;
   var backInput = document.getElementById('flash-desc-input').value;
   if(frontInput === ''){
      alert('You must enter something into the text and attribution.');
   }
   else if(backInput === ''){
      alert('You must enter something into the text and attribution.');
   }
   else{
      createFlash(frontInput,backInput);
      closeModal();
   }
}

var flashContainer = document.querySelectorAll('main.flash-container')[0];

function createFlash(frontInput,backInput){
	var request = new XMLHttpRequest();
	request.open('POST', '/addFlash');
	var flashObj = {
		front: frontInput,
		back: backInput
	};
	var requestBody = JSON.stringify(flashObj);
	request.setRequestHeader(
	   'Content-Type', 'application/json'
	);
	request.addEventListener('load', function (event) {
		if(event.target.status !== 200){
			var message = event.target.response;
			alert("Error storing flashcard in database: " + message);
		}
		else{
			var flash = Handlebars.templates.flashCard(flashObj);
			flashContainer = document.querySelectorAll('main.flash-container')[0];
			flashContainer.insertAdjacentHTML('beforeend',flash);
		}
	});
	request.send(requestBody);
}

function showBack(){
	var modalBackdrop = document.getElementById('modal-backdrop');
	var back = document.getElementById('flash-back');
	modalBackdrop.classList.remove('hidden');
	back.classList.remove('hidden');
}

var activeFlash;

flashContainer.addEventListener('click', function (event) {
	var description;
	var flash = event.target;
	if(flash.classList.contains('flash') || flash.classList.contains('flash-text')){
		activeFlash = flash;
		var request = new XMLHttpRequest();
		request.open('POST', '/showBack');
		//console.log(flash.textContent);
		var front = {
			front: flash.textContent
		};
		var requestBody = JSON.stringify(front);
		request.setRequestHeader('Content-Type', 'application/json');
		request.addEventListener('load', function (event) {
			if(event.target.status !== 200){
				var message = event.target.response;
				alert("Error fetching data from database: " + message);
			}
			else{
				description = event.target.response;
				var flashBack = document.getElementById('flash-back');
				flashBackContent = document.getElementsByClassName('flash-back-text')[0];
				flashBackContent.textContent = description;
				var modalBackdrop = document.getElementById('modal-backdrop');
				modalBackdrop.classList.remove('hidden');
				flashBack.classList.remove('hidden');
			}
		});
		request.send(requestBody);
	}
});

var closeFlashBackButton = document.getElementsByClassName('flash-back-close')[0];

closeFlashBackButton.addEventListener('click', closeFlashBack);

function closeFlashBack(){
	var modalBackdrop = document.getElementById('modal-backdrop');
	var flashBack = document.getElementById('flash-back');
	modalBackdrop.classList.add('hidden');
	flashBack.classList.add('hidden');
}

var deleteFlashButton = document.getElementById('delete-flash');

deleteFlashButton.addEventListener('click', function (event) {
	var request = new XMLHttpRequest();
	request.open('POST', '/deleteFlash');
	var front = {
		front: activeFlash.textContent
	};
	var requestBody = JSON.stringify(front);
	request.setRequestHeader('Content-Type', 'application/json');
	request.addEventListener('load', function (event) {
		if(event.target.status !== 200){
			var message = event.target.response;
			alert("Error deleting data from the DB.: " + message);
		}
		else{
			if(activeFlash.classList.contains('flash-text')){
				activeFlash = activeFlash.parentNode.parentNode;
			}
			flashContainer.removeChild(activeFlash);
			closeFlashBack();
		}
	});
	request.send(requestBody);
});

var searchBarButton = document.getElementById('titleBar-search-button');

searchBarButton.addEventListener('click',search);

var searchBar = document.getElementById('titleBar-search-input');

searchBar.addEventListener('input',search);

var flashDeleted = [];

function search(){
   var flashContainer = document.getElementsByClassName('flash-container')[0];
   var searchTerm = document.getElementById('titleBar-search-input').value.toLowerCase();
   var allflashs = document.getElementsByClassName('flash');
   var flashContent;
   for(var k = 0; k < 5; k++){
      if(flashDeleted.length > 0){
         for(var j = 0; j < flashDeleted.length; j++){
	    flashContainer.appendChild(flashDeleted.pop());
         }
      }
   }
   if(searchTerm === ''){
      return;
   }
   for(var i = 0; i < allflashs.length; i++){
      flashContent = allflashs[i].getElementsByClassName('flash-text')[0].textContent.toLowerCase();
      if(flashContent.indexOf(searchTerm) === -1){
		flashDeleted.push(allflashs[i]);
		flashContainer.removeChild(allflashs[i]);
		i -= 1;
      }
   }
}