// Get the modal
var editModel = document.getElementById('editProfileForm');//signIn form modal

// Get the button that opens the modal
var editBtn = document.getElementById("edit");

// Get the <span> element that closes the modal
var closeEditSpan = document.getElementsByClassName("closeEdit")[0];
       

// When the user clicks the button, open the modal 
editBtn.onclick = function() {
    editModel.style.display = "block";
}


closeEditSpan.onclick = function() {
    editModel.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == editModel) {
        editModel.style.display = "none";
    }
}
