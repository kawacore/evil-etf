let stockChart; // Reference for the ETF chart
let individualChart; // Reference for the individual stocks chart

// Fetch stock data for a single company
const fetchStockData = (symbol, range, interval) => {
    const url = `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    return fetch(url, {
        headers: {
            'Origin': 'https://kawacore.github.io',
            'x-requested-with': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        const chartData = data.chart.result[0];
        const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000));
        const prices = chartData.indicators.quote[0].close;
        return { timestamps, prices };
    });
};

// Update ETF chart (main graph)
const createOrUpdateETFChart = (urthData, spyData) => {
    if (stockChart) {
        stockChart.data.labels = urthData.timestamps;
        stockChart.data.datasets[0].data = urthData.prices;
        stockChart.data.datasets[1].data = spyData.prices;
        stockChart.update();
    } else {
        const ctx = document.getElementById('stockChart').getContext('2d');
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: urthData.timestamps,
                datasets: [
                    {
                        label: 'MSCI World (URTH)',
                        data: urthData.prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                    },
                    {
                        label: 'S&P 500 (SPY)',
                        data: spyData.prices,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.1,
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day' },
                        title: { display: true, text: 'Date' },
                    },
                    y: {
                        title: { display: true, text: 'Price (USD)' },
                    }
                }
            }
        });
    }
};

// Create or update individual stocks chart
const createOrUpdateIndividualChart = (data) => {
    const ctx = document.getElementById('individualChart').getContext('2d');
    const datasets = data.map(company => ({
        label: company.name,
        data: company.prices,
        borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
        fill: false,
        tension: 0.1
    }));

    if (individualChart) {
        individualChart.data.labels = data[0].timestamps; // Use timestamps from the first company
        individualChart.data.datasets = datasets;
        individualChart.update();
    } else {
        individualChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data[0].timestamps, // Use timestamps from the first company
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day' },
                        title: { display: true, text: 'Date' },
                    },
                    y: {
                        title: { display: true, text: 'Price (USD)' },
                    }
                }
            }
        });
    }
};

// Update both charts
window.updateGraph = (range, interval) => {
    Promise.all([
        fetchStockData('URTH', range, interval),
        fetchStockData('SPY', range, interval)
    ])
    .then(([urthData, spyData]) => {
        createOrUpdateETFChart(urthData, spyData);
    })
    .catch(error => {
        console.error("Error updating ETF chart:", error);
    });

    // Fetch data for individual companies
    const companies = [
        { name: "ExxonMobil", ticker: "XOM" },
        { name: "BP", ticker: "BP" },
        { name: "Chevron", ticker: "CVX" },
        { name: "Gazprom", ticker: "GAZP.MM" },
        { name: "Shell", ticker: "SHEL" },
        { name: "Saudi Aramco", ticker: "2222.SR" },
        { name: "Norilsk Nickel", ticker: "GMKN.MM" },
        { name: "TotalEnergies", ticker: "TTE" },
        { name: "Peabody Energy", ticker: "BTU" },
        { name: "Rio Tinto", ticker: "RIO" }
    ];

    Promise.all(companies.map(company => fetchStockData(company.ticker, range, interval).then(data => ({
        name: company.name,
        timestamps: data.timestamps,
        prices: data.prices
    }))))
    .then(data => {
        createOrUpdateIndividualChart(data);
    })
    .catch(error => {
        console.error("Error updating individual chart:", error);
    });
};

// Default load for 1 year
document.addEventListener('DOMContentLoaded', () => {
    updateGraph('1y', '1d');
});
