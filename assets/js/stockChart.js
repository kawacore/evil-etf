let stockChart; // Reference to the chart instance

// Function to fetch stock data using Yahoo Finance via CORS Anywhere
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

// Function to create or update the chart
const createOrUpdateChart = (urthData, spyData) => {
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

// Function to update the chart based on selected time range and interval
const updateGraph = (range, interval) => {
    Promise.all([
        fetchStockData('URTH', range, interval),
        fetchStockData('SPY', range, interval)
    ])
    .then(([urthData, spyData]) => {
        createOrUpdateChart(urthData, spyData);
    })
    .catch(error => {
        console.error("Error fetching stock data:", error);
    });
};

// Expose the updateGraph function globally
window.updateGraph = updateGraph;

// Load default view (1 year, daily data) on page load
document.addEventListener('DOMContentLoaded', () => {
    updateGraph('1y', '1d');
});
