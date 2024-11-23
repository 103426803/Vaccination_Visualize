const regions = {
    "North America": ["Canada", "United States", "Mexico", "Costa Rica"],
    "Europe": [
        "Austria", "Belgium", "Czechia", "Denmark", "Estonia", "Finland", "France",
        "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Israel", "Italy",
        "Latvia", "Lithuania", "Luxembourg", "Netherlands", "Norway", "Poland",
        "Portugal", "Slovak Republic", "Slovenia", "Spain", "Sweden", "Switzerland",
        "United Kingdom", "Bulgaria", "Croatia", "Romania", "Ukraine", "Türkiye"
    ],
    "Asia": ["China (People Republic of)", "India", "Indonesia", "Japan", "Korea"],
    "Africa": ["South Africa"],
    "South America": ["Argentina", "Brazil", "Chile", "Colombia", "Peru"],
    "Oceania": ["Australia", "New Zealand"]
};


function drawOECDLineChart(csvPath, selectedRegions) {
    const container = d3.select("#oecd-line-chart-container");
    container.selectAll("*").remove(); // Clear previous chart content

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = container.node().clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3.select("#oecd-line-chart-container")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("display", "none");

    // Get the selected countries based on selected regions
    const selectedCountries = selectedRegions.reduce((countries, region) => {
        return countries.concat(regions[region]);
    }, []);

    d3.csv(csvPath).then(data => {
        const years = ["2018", "2019", "2020", "2021", "2022", "2023"];
        const regionAverages = selectedRegions.map(region => {
            const countries = regions[region];
            return {
                region,
                averages: years.map(year => {
                    const validValues = countries
                        .map(country => {
                            const countryData = data.find(d => d.Country === country);
                            return countryData ? +countryData[year] || null : null;
                        })
                        .filter(value => value !== null && value > 0); // Exclude missing data

                    return validValues.length > 0
                        ? d3.mean(validValues)
                        : 0; // If no valid data, return 0
                })
            };
        });

        // Scales
        const x = d3.scalePoint().domain(years).range([0, width]);
        const y = d3.scaleLinear()
            .domain([0, d3.max(regionAverages, d => d3.max(d.averages))])
            .nice()
            .range([height, 0]);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        // Lines and circles
        const color = d3.scaleOrdinal()
                        .domain(selectedRegions)
                        .range(["#c10077", "#fa9a00", "#00c871", "#001837", "#da0a12", "#009ade"]);

        regionAverages.forEach((regionData, index) => {
            const lineData = years.map((year, i) => ({
                year,
                average: regionData.averages[i]
            }));

            // Draw line
            svg.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", color(regionData.region))
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(d => x(d.year))
                    .y(d => y(d.average))
                );

            // Add circles for each point
            const circles = svg.selectAll(`.circle-${index}`)
                .data(lineData)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.year))
                .attr("cy", d => y(d.average))
                .attr("r", 5)
                .attr("fill", color(regionData.region));

            // Add text next to each circle (show average value)
            circles.append("title") // Optional: adds a tooltip-like label on hover
                .text(d => `Year: ${d.year}\nAverage: ${d.average.toFixed(2)}`);

            // Add text directly on the chart
            svg.selectAll(`.text-${index}`)
                .data(lineData)
                .enter()
                .append("text")
                .attr("x", d => x(d.year)) // Position slightly to the right of the dot
                .attr("y", d => y(d.average) - 10) // Position slightly below the dot
                .style("font-size", "12px")
                .style("fill", "black")
                .text(d => d.average.toFixed(2)); // Display the average value as text
        });

        // Add legend
        const legend = svg.selectAll(".legend")
            .data(regionAverages)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", width - 15)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => color(d.region));

        legend.append("text")
            .attr("x", width - 20)
            .attr("y", 10)
            .style("text-anchor", "end")
            .text(d => d.region);
    }).catch(error => {
        console.error("Error loading OECD CSV data:", error);
    });
}




