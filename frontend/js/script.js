

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

async function uploadFile() {
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("file", document.getElementById("fileInput").files[0]);

    try {
        console.log("Uploading file...");
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
            alert("✅ Registration Successful!");
        } else {
            alert("❌ Error: " + (result.error || "Server Error"));
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("❌ Something went wrong. Error: " + error.message);
    }
}

