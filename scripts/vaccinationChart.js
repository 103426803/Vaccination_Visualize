// Function to update graphs based on dropdown selection
function updateGraph() {
    const selectedGroup = document.getElementById("data-select").value;

    // Hide all graph sections initially
    document.querySelectorAll(".graph-section").forEach(graph => {
        graph.style.display = "none";
    });

    // Show the appropriate graph and draw the chart based on selected dropdown
    if (selectedGroup === "group1") {
        document.getElementById("vaccination-chart").style.display = "block";
        drawVaccinationChart("MR_DPT4"); // Pass group1 data keys for visualization
    } else if (selectedGroup === "group2") {
        document.getElementById("vaccination-chart").style.display = "block";
        drawVaccinationChart("JE_1_2"); // Pass group2 data keys
    } else if (selectedGroup === "group3") {
        document.getElementById("vaccination-chart").style.display = "block";
        drawVaccinationChart("JE_3"); // Pass group3 data keys
    } else if (selectedGroup === "group4") {
        document.getElementById("vaccination-chart").style.display = "block";
        drawVaccinationChart("Reactions"); // Pass group4 data keys
    }
}

// Function to draw the vaccination chart based on selected data group
function drawVaccinationChart(group) {
    // Set up margin and dimensions
    const margin = { top: 30, right: 40, bottom: 50, left: 60 };
    const width = 1000;
    const height = 500;

    // Clear any previous chart content
    d3.select("#vaccination-chart").html("");

    // Load the CSV data
    d3.csv("graphs/final_project_CSV.csv").then(data => {
        // Filter and process data based on group
        let keys;
        if (group === "MR_DPT4") {
            keys = ["subject_MR_DPT4", "Vacc_MR", "Vacc_DPT4"];
        } else if (group === "JE_1_2") {
            keys = ["Subjects_JE_1_2", "Vacc_Dose1", "Vacc_Dose2"];
        } else if (group === "JE_3") {
            keys = ["Subjects_JE_3", "Vacc_Dose3"];
        } else if (group === "Reactions") {
            keys = ["Reaction_Mild", "Reaction_Severe"];
        }

        // Aggregate data by city
        const totalsByCity = {};
        data.forEach(d => {
            const city = d.City;
            if (!totalsByCity[city]) {
                totalsByCity[city] = { city };
                keys.forEach(key => {
                    totalsByCity[city][key] = 0;
                });
            }
            keys.forEach(key => {
                totalsByCity[city][key] += +d[key];
            });
        });

        // Convert to array format for D3
        const cityData = Object.values(totalsByCity);

        // Create SVG container
        const svg = d3.select("#vaccination-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales
        const x0 = d3.scaleBand()
            .domain(cityData.map(d => d.city))
            .range([0, width])
            .padding(0.1);

        const x1 = d3.scaleBand()
            .domain(keys)
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(cityData, d => d3.max(keys, key => d[key]))])
            .nice()
            .range([height, 0]);

        // Define color scale
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeSet2);

        // Draw grouped bars
        svg.append("g")
            .selectAll("g")
            .data(cityData)
            .join("g")
            .attr("transform", d => `translate(${x0(d.city)},0)`)
            .selectAll("rect")
            .data(d => keys.map(key => ({ key, value: d[key] })))
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key));

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr("dy", "-0.5em")
            .attr("text-anchor", "middle")
            .text("City");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Vaccination Counts");
    }).catch(error => {
        console.error("Error loading CSV data:", error);
    });
}
