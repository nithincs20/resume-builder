//Open modal
function openModal(templateName, imgSrc) {
    document.getElementById("resumeModal").style.display = "flex";
    document.getElementById("modal-title").innerText = templateName;
    document.getElementById("modal-image").src = imgSrc; 
}


//Close the modal
function closeModal() {
    document.getElementById("resumeModal").style.display = "none";
}
