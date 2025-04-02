
function openModal(name, imageSrc) {
    document.getElementById("modal-title").textContent = name;
    document.getElementById("modal-image").src = imageSrc;
    document.getElementById("resumeModal").style.display = "block";
}

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


//resume upload-extract-register code 

function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const nameInput = document.getElementById("name").value.trim();
    const emailInput = document.getElementById("email").value.trim();

    if (!fileInput.files.length) {
        alert("Please upload a resume.");
        return;
    }

    if (!nameInput || !emailInput) {
        alert("Name and email are required.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("name", nameInput);
    formData.append("email", emailInput);

    fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Resume uploaded successfully!\n" +
                  "Name: " + data.name + "\n" +
                  "Email: " + data.email);
        }
    })
    .catch(error => console.error("Error:", error));
}