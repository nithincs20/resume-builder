document.addEventListener("DOMContentLoaded", () => {
    fetchTemplates();
    updateNavbarForAdmin();
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

function updateNavbarForAdmin() {
    const isAdmin = localStorage.getItem("isAdmin"); 
    if (isAdmin) {
        const aboutLink = document.querySelector("nav ul li a[href='about.html']");
        if (aboutLink) {
            aboutLink.textContent = "Register New User";
            aboutLink.href = "userCreation.html";
        }
    }
}
