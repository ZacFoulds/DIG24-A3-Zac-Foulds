document.addEventListener("DOMContentLoaded", function() {
    // Loading screen functionality
    const loadingBar = document.getElementById('loading-bar');
    const loadingScreen = document.getElementById('loading-screen');

    // Start loading animation
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 0);

    // Hide loading screen after 3 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 3000);

    // Video container JS
    const container = document.querySelector(".video-container");
    const iframes = container.querySelectorAll("iframe");
    const totalVideos = iframes.length;
    let currentIndex = 0;

    const updateContainerPosition = () => {
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    document.getElementById("scroll-left").addEventListener("click", function() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalVideos - 1;
        }
        updateContainerPosition();
    });

    document.getElementById("scroll-right").addEventListener("click", function() {
        if (currentIndex < totalVideos - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateContainerPosition();
    });

    window.addEventListener("resize", updateContainerPosition);
    updateContainerPosition();

    // first chart data
    const adData = [
        { category: "Any Advertising", lessThanOnce: 22, onceAWeek: 14, twoToThreeTimes: 23, fourOrMore: 41 },
        { category: "Television", lessThanOnce: 35, onceAWeek: 14, twoToThreeTimes: 20, fourOrMore: 32 },
        { category: "Online", lessThanOnce: 65, onceAWeek: 13, twoToThreeTimes: 11, fourOrMore: 11 },
        { category: "Team/Player uniform/Merch", lessThanOnce: 66, onceAWeek: 15, twoToThreeTimes: 9, fourOrMore: 10 },
        { category: "Social Media", lessThanOnce: 68, onceAWeek: 11, twoToThreeTimes: 10, fourOrMore: 10 },
        { category: "Radio", lessThanOnce: 65, onceAWeek: 14, twoToThreeTimes: 12, fourOrMore: 9 },
        { category: "Print media", lessThanOnce: 69, onceAWeek: 14, twoToThreeTimes: 8, fourOrMore: 9 },
        { category: "Streamed content", lessThanOnce: 70, onceAWeek: 12, twoToThreeTimes: 10, fourOrMore: 9 },
        { category: "Outdoor signage", lessThanOnce: 72, onceAWeek: 14, twoToThreeTimes: 9, fourOrMore: 7 },
        { category: "Betting affiliates", lessThanOnce: 82, onceAWeek: 7, twoToThreeTimes: 5, fourOrMore: 5 },
        { category: "Direct messages", lessThanOnce: 82, onceAWeek: 8, twoToThreeTimes: 6, fourOrMore: 5 }
    ];

    /// second chart data
    const gamblingData = [
        { label: "Any Gambling", value: 72.9 },
        { label: "Lotteries or Scratchies", value: 63.8 },
        { label: "Horse Racing", value: 38.1 },
        { label: "Sports", value: 33.8 },
        { label: "Poker Machines", value: 33.4 },
        { label: "Keno or Bingo", value: 29.8 },
        { label: "Greyhound Racing", value: 24.4 },
        { label: "Harness Racing", value: 22.5 },
        { label: "Casino Table Games", value: 22.4 },
        { label: "Novelty Betting", value: 17.2 },
        { label: "Online Casino Games", value: 17.0 },
        { label: "Other", value: 18.5 }
    ];

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 120, left: 150 };

    // tooltip
    const createTooltip = () => {
        return d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.7)")
            .style("color", "white")
            .style("padding", "5px 10px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);
    };

    const tooltip = createTooltip();

    const showTooltip = (event, d, content) => {
        tooltip
            .html(content)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px")
            .style("opacity", 1);
    };

    const hideTooltip = () => {
        tooltip.style("opacity", 0);
    };

    const createStackedBarChart = (data, chartId) => {
        const svg = d3.select(chartId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 50)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const categories = data.map(d => d.category);
        const seriesNames = ["lessThanOnce", "onceAWeek", "twoToThreeTimes", "fourOrMore"];
        const seriesLabels = ["Less Than Once A Week", "About Once A Week", "2 to 3 Times A Week", "4 or More Times A Week"];
        const colors = ['#D83F70', '#FFA931', '#682A80', '#4285F4'];

        const stackedData = d3.stack().keys(seriesNames)(data);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Where and how often Australian adults had seen or heard wagering advertising");

        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .padding(0.1);

        const color = d3.scaleOrdinal()
            .domain(seriesNames)
            .range(colors);

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("y", d => y(d.data.category))
            .attr("x", 0)
            .attr("width", 0)
            .attr("height", y.bandwidth())
            .on("mouseover", function(event, d) {
                const category = d.data.category;
                const seriesName = d3.select(this.parentNode).datum().key;
                const value = d.data[seriesName];
                showTooltip(event, d, `${category}<br>${seriesName}: ${value}%`);
            })
            .on("mousemove", function(event, d) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", hideTooltip)
            .transition()
            .duration(1000)
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("x", d => x(d[0]));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(10));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 60)
            .attr("text-anchor", "middle")
            .text("Percentage");

        const legend = svg.append("g")
            .attr("transform", `translate(0, ${height + 80})`);

        seriesLabels.forEach((label, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(${i * 150}, 0)`);

            legendRow.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", colors[i]);

            legendRow.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .attr("text-anchor", "start")
                .style("font-size", "12px")
                .text(label);
        });
    };

    const createBarChart = (data, chartId, color) => {
        const svg = d3.select(chartId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Gambling among Australian adults in the past 12 months, 2022");

        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, height])
            .padding(0.1);

        svg.append("g")
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => y(d.label))
            .attr("height", y.bandwidth())
            .attr("fill", color)
            .on("mouseover", function(event, d) {
                showTooltip(event, d, `${d.label}: ${d.value}%`);
            })
            .on("mousemove", function(event, d) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", hideTooltip)
            .transition()
            .duration(1000)
            .attr("width", d => x(d.value));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(10));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 60)
            .attr("text-anchor", "middle")
            .text("Percentage");
    };

    // when reloading charts
    const reanimateChart = (chartId, data, type) => {
        d3.select(chartId).select("svg").remove();
        if (type === 'stacked') {
            createStackedBarChart(data, chartId);
        } else {
            createBarChart(data, chartId, "#4CAF50");
        }
    };

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5
    };

    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === "adChart") {
                    reanimateChart("#adChart", adData, 'stacked');
                } else if (entry.target.id === "gamblingChart") {
                    reanimateChart("#gamblingChart", gamblingData, 'simple');
                }
            }
        });
    };

    const adChartObserver = new IntersectionObserver(handleIntersection, observerOptions);
    const gamblingChartObserver = new IntersectionObserver(handleIntersection, observerOptions);

    adChartObserver.observe(document.getElementById("adChart"));
    gamblingChartObserver.observe(document.getElementById("gamblingChart"));

    const galleryImages = document.querySelectorAll('.gallery-image');
    const dialog = document.getElementById('imageDialog');
    const dialogImage = document.getElementById('dialogImage');
    const closeDialog = document.getElementById('closeDialog');


    // show dialog when image clicked
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            dialogImage.src = img.src;
            dialog.show();
        });
    });

    closeDialog.addEventListener('click', () => {
        dialog.hide();
    });


    // Back to Top Button functionality
    const backToTopButton = document.getElementById('backToTop');

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});