// Function to draw the vaccination chart based on the selected data group
function drawVaccinationChart(group) {
    // Set up margin and dimensions
    const margin = { top: 60, right: 40, bottom: 80, left: 60 };
    const width = 800;
    const height = 400;

    // Clear any previous chart content
    d3.select("#vaccination-chart").html("");

    // Load the CSV data
    d3.csv("graphs/final_project_CSV.csv").then(data => {
        // Define group-specific keys and subject column
        let keys, subjectKey;
        if (group === "MR_DPT4") {
            keys = ["Vacc_MR", "Vacc_DPT4"];
            subjectKey = "Subjects_MR_DPT4";
        } else if (group === "JE_1_2") {
            keys = ["Vacc_Dose1", "Vacc_Dose2"];
            subjectKey = "Subjects_JE_1_2";
        } else if (group === "JE_3") {
            keys = ["Vacc_Dose3"];
            subjectKey = "Subjects_JE_3";
        } else if (group === "Reactions") {
            keys = ["Reaction_Mild", "Reaction_Severe"];
        } else {
            console.error("Invalid group specified");
            return;
        }

        // Aggregate data by city
        const totalsByCity = {};
        data.forEach(d => {
            const city = d.City;
            if (!totalsByCity[city]) {
                totalsByCity[city] = { city, totalSubjects: 0 };
                keys.forEach(key => {
                    totalsByCity[city][key] = 0;
                });
            }

            // Calculate total subjects
            if (group === "Reactions") {
                totalsByCity[city].totalSubjects += keys.reduce((sum, key) => sum + (+d[key] || 0), 0);
            } else {
                totalsByCity[city].totalSubjects += +d[subjectKey];
            }

            // Add up values for each key
            keys.forEach(key => {
                totalsByCity[city][key] += +d[key] || 0;
            });
        });

        // Convert to array format and calculate percentages
        const cityData = Object.values(totalsByCity).map(city => {
            const percentages = keys.reduce((acc, key) => {
                acc[key] = city.totalSubjects > 0 ? (city[key] / city.totalSubjects) * 100 : 0;
                return acc;
            }, {});
            return { city: city.city, ...percentages };
        });

        // Create SVG container
        const svg = d3.select("#vaccination-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add a title
        const titles = {
            "MR_DPT4": "MR and DPT4 coverage in children 12 - 23 months",
            "JE_1_2": "JE Dose 1 and 2 coverage in children 12 - 23 months",
            "JE_3": "JE Dose 3 coverage in children 12 - 23 months",
            "Reactions": "Vaccine Reactions"
        };
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .text(`${titles[group] || group}`);

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
            .domain([0, 100])
            .nice()
            .range([height, 0]);

        // Define color scale
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#4e79a6", "#f28e2c"]);

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
            .attr("y", height)
            .attr("width", x1.bandwidth())
            .attr("height", 0)
            .attr("fill", d => color(d.key))
            .transition()
            .duration(800)
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value));

        // Add percentages above bars
        svg.append("g")
            .selectAll("g")
            .data(cityData)
            .join("g")
            .attr("transform", d => `translate(${x0(d.city)},0)`)
            .selectAll("text")
            .data(d => keys.map(key => ({ key, value: d[key] })))
            .join("text")
            .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
            .attr("y", d => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .text(d => `${d.value.toFixed(1)}%`)
            .style("font-size", "12px")
            .style("fill", "black");

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .style("text-anchor", "middle")
            .style("font-size", "12px");

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 20)
            .attr("text-anchor", "middle")
            .text("City");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .text("Percentage (%)");

        // Add legend
        const legendMapping = {
            "Vacc_MR": "Measles-Rubella (MR) Vaccination",
            "Vacc_DPT4": "DPT4 Vaccination",
            "Vacc_Dose1": "JE Dose 1 Vaccination",
            "Vacc_Dose2": "JE Dose 2 Vaccination",
            "Vacc_Dose3": "JE Dose 3 Vaccination",
            "Reaction_Mild": "Mild Reactions",
            "Reaction_Severe": "Severe Reactions"
        }
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 100},${margin.top - 120})`);
    
        keys.forEach((key, i) => {
            const legendItem = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);

            legendItem.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(key));

            legendItem.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .text(legendMapping[key] || key)
                .style("font-size", "12px")
                .attr("text-anchor", "start");
        });
    }).catch(error => {
        console.error("Error loading CSV data:", error);
    });
}
