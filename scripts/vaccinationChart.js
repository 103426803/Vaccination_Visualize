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
    } else if (selectedGroup === "group5") {
        document.getElementById("vaccination-chart").style.display = "block";
        drawOECDChart("OECD Threshold");
    } else if (selectedGroup === "group6") {
        document.getElementById("vaccination-chart").style.display = "block";
        drawOECDChart("OECD No Threshold");
}

// Function to draw the vaccination chart based on selected data group
function drawVaccinationChart(group) {
    const margin = { top: 30, right: 40, bottom: 50, left: 60 };
    const width = 1000;
    const height = 500;

    d3.select("#vaccination-chart").html("");

    d3.csv("final_project_CSV.csv").then(data => {
        let keys;
        if (group === "MR_DPT4") {
            keys = ["Subjects_MR_DPT4", "Vacc_MR", "Vacc_DPT4"];
        } else if (group === "JE_1_2") {
            keys = ["Subjects_JE_1_2", "Vacc_Dose1", "Vacc_Dose2"];
        } else if (group === "JE_3") {
            keys = ["Subjects_JE_3", "Vacc_Dose3"];
        } else if (group === "Reactions") {
            keys = ["Reaction_Mild", "Reaction_Severe"];
        }

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

        const cityData = Object.values(totalsByCity);

        const svg = d3.select("#vaccination-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(<span class="math-inline">\{margin\.left\},</span>{margin.top})`);

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

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeSet2);

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

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

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

function drawOECDChart(group) {
    const margin = { top: 30, right: 40, bottom: 50, left: 60 };
    const width = 1000;
    const height = 500;

    d3.select("#oecd-chart").html("");

    d3.csv(oecd.csv).then(data => {
        let keys;
        if (group === "OECD Threshold") {
            keys = ["2018, 2019, 2020, 2021, 2022, 2023"];
        } else if (group === "OECD No Threshold") {
            keys = ["2018, 2019, 2020, 2021, 2022, 2023"];
        }
        const years = data.columns.slice(1);
        const countries = data.map(d => d[""]);

        const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max(years, year => +d[year]))])
            .nice()
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(+d.value));

        svg.selectAll(".line")
            .data(countries.map(country => {
                return years.map(year => ({ year, value: data.find(d => d[""] === country)[year] }));
            }))
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", (d, i) => colorScale(i));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .style("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .style("text-anchor", "middle")
            .text("Value");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .text(title);
    }).catch(error => {
        console.error("Error loading CSV data:", error);
    });
}
}