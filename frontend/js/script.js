
document.addEventListener("DOMContentLoaded", () => {
    fetchTemplates();
});

function fetchTemplates() {
    fetch("http://localhost:5000/templates") 
        .then(response => response.json())
        .then(data => displayTemplates(data))
        .catch(error => console.error("Error fetching templates:", error));
}

function displayTemplates(templates) {
    const container = document.getElementById("templates-container");
    container.innerHTML = "";

    templates.forEach(template => {
        const templateCard = document.createElement("div");
        templateCard.classList.add("template-card");

        templateCard.innerHTML = `
            <img onclick="openModal('${template.name}', '${template.image}')" src="${template.image}" alt="${template.name}">
            <h2>${template.name}</h2>
           `;

        container.appendChild(templateCard);
    });
}

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


  function sendEmail() {
    const email = document.getElementById("email").value;
    const alertMessage = document.getElementById("alertMessage").value;
    const status = document.getElementById("status");

    if (!email || !alertMessage) {
        status.textContent = "Please fill all fields!";
        status.style.color = "red";
        return;
    }

    fetch("http://localhost:5000/send-alert", { // Change the URL if hosted
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, alertMessage })
    })
    .then(response => response.text())
    .then(data => {
        console.log("Email sent successfully:", data); // Console log the response
        alert("Email sent successfully! ✅"); // Show alert
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to send email! ❌"); // Show error alert
    });
}
