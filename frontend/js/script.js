
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

// //Get files
// async function uploadFile() {
   
//     const fileInput = document.getElementById("fileInput");
//     const formData = new FormData();
//     formData.append("file", fileInput.files[0]);
  
//    //Files in :http://localhost:5000/files

//     const res = await fetch("http://localhost:5000/upload", {
//       method: "POST",
//       body: formData,
//     });
  
//     const data = await res.json();
//     console.log("File URL:", data.fileUrl);
//   }


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


//resume
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const resumeTextArea = document.getElementById("resumeText");

    if (!fileInput.files.length) {
        alert("Please select a file!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        // Upload file
        const uploadRes = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
            throw new Error(uploadData.message || "File upload failed");
        }

        console.log("File URL:", uploadData.fileUrl);

        // Extract text from the uploaded PDF
        const filename = uploadData.fileUrl.split("/").pop();
        const extractRes = await fetch(`http://localhost:5000/extract/${filename}`);

        const extractData = await extractRes.json();

        if (!extractRes.ok) {
            throw new Error(extractData.message || "Failed to extract text");
        }

        // Display extracted resume text
        resumeTextArea.value = extractData.resumeText;

        // Store extracted resume text in localStorage (temporary storage)
        localStorage.setItem("resumeText", extractData.resumeText);

    } catch (error) {
        console.error("Error:", error);
        alert("Error processing file: " + error.message);
    }
    location.reload();
}

// Form Submission with Resume Data
document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const resumeTextArea = document.getElementById("resumeText");
    const fileInput = document.getElementById("fileInput");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const resumeText = localStorage.getItem("resumeText");

    if (!name || !email) {
        alert("Please fill in all fields.");
        return;
    }

    if (!resumeText) {
        alert("Please upload a resume and extract data before submitting.");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, resumeText }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Registration failed");
        }

        alert("User registered successfully!");

        // Clear stored resume text after submission
        localStorage.removeItem("resumeText");

        // Reset form fields manually
        nameInput.value = "";
        emailInput.value = "";
        resumeTextArea.value = "";
        fileInput.value = ""; // Reset file input only after submission

    } catch (error) {
        console.error("Error:", error);
        alert("Error registering user: " + error.message);
    }
});


