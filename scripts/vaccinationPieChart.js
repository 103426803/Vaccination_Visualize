// Function to draw pie charts for the selected group
function drawPieChart(group) {
    // Set up margin and dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 300; // Adjust size to fit multiple charts
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Clear any previous chart content
    d3.select("#pie-chart").html("");

    const titleMapping = {
        "Vacc_MR": "MR",
        "Vacc_DPT4": "DPT4",
        "Vacc_Dose1": "JE Dose 1",
        "Vacc_Dose2": "JE Dose 2",
        "Vacc_Dose3": "JE Dose 3",
        "Reaction_Mild": "Mild Reactions",
        "Reaction_Severe": "Severe Reactions"
    }
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

        // Aggregate data for each pie chart
        const aggregatedData = {};
        let totalSubjects = 0;
        data.forEach(d => {
            totalSubjects += +d[subjectKey] || 0; // Sum up total subjects
            keys.forEach(key => {
                if (!aggregatedData[key]) {
                    aggregatedData[key] = 0;
                }
                aggregatedData[key] += +d[key] || 0; // Sum up counts for each key
            });
        });

        // Create a pie chart for each key
        keys.forEach((key, index) => {
            const pieData = [
                {
                    label: key,
                    value: aggregatedData[key],
                    percentage: totalSubjects > 0 ? ((aggregatedData[key] / totalSubjects) * 100).toFixed(1) : 0
                },
                {
                    label: "Others",
                    value: totalSubjects - aggregatedData[key],
                    percentage: totalSubjects > 0 ? ((totalSubjects - aggregatedData[key]) / totalSubjects * 100).toFixed(1) : 0
                }
            ];

            // Create a container for each pie chart
            const chartContainer = d3.select("#pie-chart")
                .append("div")
                .attr("class", "chart-container")
                .style("display", "inline-block")
                .style("width", keys.length === 1 ? "100%" : "45%")
                .style("text-align", keys.length === 1 ? "center" : "left")
                .style("position", "relative")
                .style("margin", keys.length === 1 ? "0 auto" : "10px")
                .style("vertical-align", "top");

            // Add a title for each pie chart
            const chartTitle = titleMapping[key] || key;
            chartContainer.append("h3")
                        .style("text-align", "center")
                        .style("font-weight", "bold")
                        .style("margin-bottom", "10px")
                        .text(chartTitle);

            // Create an SVG container for the pie chart
            const svg = chartContainer
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${(width + margin.left + margin.right) / 2}, ${(height + margin.top + margin.bottom) / 2})`);

            // Create color scale
            const groupColorSchemes = ["#4e79a6", "#f28e2c"];
            const otherColor = "#e6e6e6" // Default color for "Others"

            const color = label => {
                if (label === "Others") {
                    return otherColor;
                }
                return groupColorSchemes[index % groupColorSchemes.length];
            }

            // Create pie layout and arc generator
            const pie = d3.pie()
                .value(d => d.value);

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            // Draw pie chart slices
            svg.selectAll("path")
                .data(pie(pieData))
                .join("path")
                .attr("d", arc)
                .attr("fill", d => color(d.data.label))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .transition()
                .duration(1000)
                .attrTween("d", function(d) {
                    const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });

            // Add labels with percentages to each slice
            svg.selectAll("text")
                .data(pie(pieData))
                .join("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("dy", "0.35em")
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .text(d => `${d.data.percentage}%`);

            // Add legend
            const legend = chartContainer.append("div")
            .attr("class", "legend")
            .style("position", "absolute")
            .style("top", "10px")
            .style("right", "10px");

            // Define the legend data
            const legendData = pieData.map((d, i) => ({
            label: d.label === "Others" ? "Others" : titleMapping[d.label] || d.label,
            color: color(d.label)
            }));

            // Create legend items
            legendData.forEach(item => {
                const legendItem = legend.append("div")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("margin-bottom", "5px");

                // Color box
                legendItem.append("div")
                    .style("width", "15px")
                    .style("height", "15px")
                    .style("background-color", item.color)
                    .style("margin-right", "5px");

                // Label
                legendItem.append("span")
                    .text(item.label)
                    .style("font-size", "12px");
            });
        });
    });
}
