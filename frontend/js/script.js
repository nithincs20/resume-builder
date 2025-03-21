
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


//adminlogin


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get form values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Send login request to backend
        const response = await fetch("http://localhost:5000/AdminLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.status === "success") {
            localStorage.setItem("token", data.token); // Store JWT token in localStorage
            window.location.href = "template.html"; // Redirect to Admin Dashboard
        } else {
            alert(data.message || "Invalid credentials,Login Failed!");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});