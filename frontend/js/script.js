
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

  document.addEventListener("DOMContentLoaded", function () {
    // Sample resume data (this can be replaced with API data)
    const resumeData = {
        name: "John Doe",
        job_title: "Software Engineer",
        email: "johndoe@example.com",
        phone: "+1 234 567 890",
        summary: "Experienced software engineer with expertise in web development.",
        skills: ["JavaScript", "React.js", "Node.js", "MongoDB", "Express.js"],
        experience: [
            {
                company: "XYZ Tech",
                position: "Senior Software Engineer",
                year: "2021 - Present",
                description: "Developing and maintaining scalable web applications using modern JavaScript frameworks."
            },
            {
                company: "ABC Corp",
                position: "Software Developer",
                year: "2018 - 2021",
                description: "Built and optimized APIs, improving application performance and scalability."
            }
        ],
        education: {
            institution: "ABC University",
            degree: "BSc in Computer Science",
            year: "2017"
        }
    };

    // Get the Handlebars template from HTML
    const templateSource = document.getElementById("resume-template").innerHTML;

    // Compile the template into a function
    const template = Handlebars.compile(templateSource);

    // Generate the HTML by passing the data
    const compiledHtml = template(resumeData);

    // Insert the generated HTML into the page
    document.getElementById("resume-container").innerHTML = compiledHtml;
});
