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

// Function to update graphs based on dropdown selection
function updateGraph() {
    const chartType = document.querySelector('input[name="chart"]:checked').value;
    const pieOptions = document.getElementById("pie-options");
    const dropDown = document.getElementById("dropdown");

    if (chartType === "pie") {
        pieOptions.style.display = "block"; // Show pie options
        dropDown.style.display = "none";
    } else {
        pieOptions.style.display = "none"; // Hide pie options
        dropDown.style.display = "block";
    }
    // Get selected values from dropdowns
    const dataSelectValue = document.getElementById("data-select").value;
    const categorySelectValue = document.getElementById("category-select").value;

    // Hide all graph sections initially
    document.querySelectorAll(".graph-section").forEach(graph => {
        graph.style.display = "none";
    });

    // Determine which graph to display based on selected chart type
    if (chartType === "pie") {
        document.getElementById("pie-chart").style.display = "block"; // Show pie chart
        drawPieChart(categorySelectValue); // Pass selected category to pie chart function
    } else {
        document.getElementById("vaccination-chart").style.display = "block"; // Show bar chart

        // Call drawVaccinationChart with appropriate data group
        switch (dataSelectValue) {
            case "group1":
                drawVaccinationChart("MR_DPT4");
                break;
            case "group2":
                drawVaccinationChart("JE_1_2");
                break;
            case "group3":
                drawVaccinationChart("JE_3");
                break;
            case "group4":
                drawVaccinationChart("Reactions");
                break;
        }
    }
}




