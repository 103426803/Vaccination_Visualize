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

function getSelectedRegions() {
    const selectedRegions = [];
    document.querySelectorAll('#region-selection input[type="checkbox"]:checked').forEach(checkbox => {
        selectedRegions.push(checkbox.value);
    });
    return selectedRegions;
}

// Function to update graphs based on dropdown selection
function updateGraph() {
    const chartType = document.querySelector('input[name="chart"]:checked').value;
    const dataSelectValue = document.getElementById("data-select").value;

    document.querySelectorAll(".graph-section").forEach(graph => {
        graph.style.display = "none";
    });

    if (chartType === "pie") {
        document.getElementById("dropdown").style.display = "block";
        document.getElementById("region-selection").style.display = "none";
        document.getElementById("pie-chart").style.display = "block"; // Show pie options
        switch (dataSelectValue) {
            case "group1": // MR and DPT4
                drawPieChart("MR_DPT4");
                break;
            case "group2": // JE Dose 1 & 2
                drawPieChart("JE_1_2");
                break;
            case "group3": // JE Dose 3
                drawPieChart("JE_3");
                break;
            case "group4": // Reactions
                drawPieChart("Reactions");
                break;
            default:
                console.error("Invalid group selected.");
                break;
        }
        document.getElementById("chart-description").innerHTML = getDescription(dataSelectValue);
        document.getElementById("chart-summary").innerHTML = getSummary(dataSelectValue, chartType);
    } else if (chartType === "bar") {
        document.getElementById("dropdown").style.display = "block";
        document.getElementById("region-selection").style.display = "none";
        document.getElementById("vaccination-chart").style.display = "block";

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
        document.getElementById("chart-description").innerHTML = getDescription(dataSelectValue);
        document.getElementById("chart-summary").innerHTML = getSummary(dataSelectValue, chartType);
    } else if (chartType === "oecd-line") {
        document.getElementById("dropdown").style.display = "none";
        document.getElementById("region-selection").style.display = "block";
        document.getElementById("oecd-line-chart-container").style.display = "block";

        document.getElementById("chart-description").innerHTML = getDescription("oecd-line");
        document.getElementById("chart-summary").innerHTML = getSummary("oecd-line", chartType);
        const selectedRegions = getSelectedRegions();
        drawOECDLineChart("graphs/oecd_no_threshold.csv", selectedRegions);
    }
        
    
}




