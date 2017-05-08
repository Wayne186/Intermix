// Get the modal
var signInModal = document.getElementById('login');//signIn form modal
var acfModal = document.getElementById('accountCreationForm');//account creation form modal

// Get the button that opens the modal
var signInBtn = document.getElementById("loginBtn");
var acfBtn = document.getElementById("acfBtn");
// Get the <span> element that closes the modal
var closeLoginSpan = document.getElementsByClassName("closeLogin")[0];
var closeACFSpan = document.getElementsByClassName("closeACF")[0];        

// When the user clicks the button, open the modal 
signInBtn.onclick = function() {
    signInModal.style.display = "block";
}

acfBtn.onclick = function() {
    acfModal.style.display = "block";
}

closeLoginSpan.onclick = function() {
    signInModal.style.display = "none";
}
closeACFSpan.onclick = function() {
    acfModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == signInModal) {
        signInModal.style.display = "none";
    }
}

window.onclick = function(event) {
    if (event.target == acfModal) {
        acfModal.style.display = "none";
    }
}
