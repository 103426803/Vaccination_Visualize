function navigateTo(sectionId) {
    document.querySelectorAll(".content-section").forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "graphs") {
        document.getElementById("data-select").selectedIndex = 0;
        updateGraph();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    navigateTo("home");
});



