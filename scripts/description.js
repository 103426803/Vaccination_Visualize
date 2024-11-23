const chartDescription = {
    "group1": {
        "title": "Percentage of Children aged 12-23 months receiving Measles-Rubella and DPT4 Vaccines",
        "desc": "This chart displays the percentage of children who received Measles-Rubella and DPT4 compare to the total number of subjects in 5 provinces of Hanoi, Hai Phong, Thai Binh, Ha Nam, Nam Dinh",
        "summaryBarChart": "MR vaccine coverages reached over 90% in 4 of 5 provinces, except Thai Binh. However, DPT4 vaccine coverages was lower than target for the year of 2023 (85%) in all provinces due to vaccine shortage. A big catch-up should be deployed in this areas in 2024.",
        "summaryPieChart": " One of every twelve children aged between 12 and 23 months missed MR vaccine in 2023. And one of every four children missed DPT4 vaccine in the second year of their life."
    },
    "group2": {
        "title": "Percentage of Children aged 12-23 months receiving Dose 1 and/or Dose 2 of Japanese Encephalitis Vaccine",
        "desc": "This chart displays the percentage of children who received each vaccine of Japanese Encephalitis Dose 1 and 2 compare to the total number of subjects in 5 provinces of Hanoi, Hai Phong, Thai Binh, Ha Nam, Nam Dinh",
        "summaryBarChart": "In 2023, dose 1 & 2 coverages of JE vaccine reached over 95% among children from 1-5 years-old in all provinces. Implementation of JE vaccine met target for the year of 2023.",
        "summaryPieChart": "High immunity against Japanese Encephalitis was proved by high vaccine coverage among the children aged between 12 and 23 months in 2023."
    },
    "group3": {
        "title": "Percentage of Children aged 12-23 months receiving Japanese Encephalitis Dose 3 Vaccine",
        "desc": "This chart displays the percentage of children who received each vaccine of Japanese Encephalitis Dose 3 compare to the total number of subjects in 5 provinces of Hanoi, Hai Phong, Thai Binh, Ha Nam, Nam Dinh",
        "summaryBarChart": "High performance of JE3 for children aged 2-5 years reported in 4 provinces of Hai Phong, Thai Binh, Ha Nam, and Nam Dinh. But, medium vaccine drop out rate (JE2-3) was in Hanoi. It may caused by complicated migration in this urban area.",
        "summaryPieChart": "However, medium JE2-3 vaccine drop-out rate caused missing dose of one of every 12 children aged between 2 and 5 years"
    }, 
    "group4": {
        "title": "Percentage of Children aged 12-23 months reporting adverse reactions (Mild & Severe)",
        "desc": "This chart displays the percentage of children who had adverse reactions after being vaccined from any vaccines compare to the total number of subjects in 5 provinces of Hanoi, Hai Phong, Thai Binh, Ha Nam, Nam Dinh"
    },
    "oecd-line": {
        "title": "OECD Infant Mortality Rates (2018–2023)",
        "desc": "This chart displays infant mortality rates across OECD countries over the years 2018–2023.",
        "summary": "A remarkable reduction of under 1 mortality rates were recognized in Asia during the period from 2018 to 2023. The Europe sustained a low rate over the years while this indicator increased in the North America in 2021 due to COVID-19 pandemic. However there's a sudden drop in 2022 onwards due to lack of submitted data."
    },
    "default": {
        "title": "No Description Available",
        "desc": "Please select a data group to see the description."
    }
};

function getDescription(group) {
    const chartData = chartDescription[group] || chartDescription["default"];
    return `
        <h3>${chartData.title}</h3>
        <p>${chartData.desc}</p>
        <hr>
    `;
}

function getSummary(group, chartType) {
    const chartData = chartDescription[group] || chartDescription["default"];
    if (chartType == "bar") {
        return `
            <h5>Summary</h5>
            <p>${chartData.summaryBarChart}</p>
        `;
    } else if (chartType == "pie") {
        return `
            <h5>Summary</h5>
            <p>${chartData.summaryPieChart}</p>
        `;
    } else {
        return `
            <h5>Summary</h5>
            <p>${chartData.summary}</p>
        `;
    }
    
}   