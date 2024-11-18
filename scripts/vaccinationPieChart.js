// Function to draw the pie chart based on selected data group
function drawPieChart(group) {
    // Set up margin and dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;
    const labelArc = d3.arc().outerRadius(radius - 30).innerRadius(radius - 30);

    // Clear any previous chart content
    d3.select("#pie-chart").html("");

    // Load the CSV data
    d3.csv("graphs/final_project_CSV.csv").then(data => {

        console.log("Loaded data:", data);
        // Filter and process data based on group
        let pieData = [];

        data.forEach(d => {
            pieData.push({ key: d.City, value: +d[group]});
        })

        console.log("Pie data", pieData);

        const aggregatedData = {};
        pieData.forEach(d => {
            if (aggregatedData[d.key]) {
                aggregatedData[d.key] += d.value;
            } else {
                aggregatedData[d.key] = d.value;
            }
        });

        // Convert the aggregated object back into an array
        const aggregatedPieData = Object.entries(aggregatedData).map(([key, value]) => ({ key, value }));
     
        console.log("Aggregated Pie Data:", aggregatedPieData);
        // Create an SVG container for the pie chart
        const svg = d3.select("#pie-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Create color scale
        const color = d3.scaleOrdinal()
            .domain(aggregatedPieData.map(d => d.key))
            .range(d3.schemeSet2);

        // Create pie layout and arc generator
        const pie = d3.pie()
            .value(d => d.value);
            
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Draw pie chart slices
        svg.selectAll("path")
            .data(pie(aggregatedPieData))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.key))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .transition()
            .duration(2000);

        // Add labels to each slice
        svg.selectAll("text")
            .data(pie(aggregatedPieData))
            .join("text")
            .transition()
            .duration(2000)
            .attr("transform", d => {
                const angle = d.endAngle - d.startAngle;
                if (angle > 0.45) {
                    return `translate(${arc.centroid(d)})`;
                } else {
                    // Position at the outer edge
                    return `translate(${labelArc.centroid(d)})`;
                }
            })
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .text(d => `${d.data.key}: ${d.data.value}`);

    }).catch(error => {
        console.error("Error loading CSV data:", error);
    });
}
