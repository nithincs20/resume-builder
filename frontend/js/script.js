//Open modal
function openModal(card) {
    document.getElementById("resumeModal").style.display = "flex";
    document.getElementById("modal-title").innerText = card.querySelector("h2").innerText;
    document.getElementById("modal-image").src = card.querySelector("img").src;
}


//Close the modal
function closeModal() {
    document.getElementById("resumeModal").style.display = "none";
}

//Resume selcted
function updateLabel(inputElement) {
    let labelSpan = inputElement.nextElementSibling; 
    if (inputElement.files.length > 0) {
        labelSpan.textContent = "Resume Selected"; 
    } else {
        labelSpan.textContent = "Select Resume"; 
    }
}

//Get files
async function uploadFile() {
   
    const fileInput = document.getElementById("fileInput");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
  
   //Files in :http://localhost:5000/files

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    console.log("File URL:", data.fileUrl);
  }