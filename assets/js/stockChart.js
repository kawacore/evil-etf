let stockChart; // Reference for the ETF chart

// Fetch stock data for a single company
const fetchStockData = (symbol, range, interval) => {
    const url = `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    console.log('Request URL:', url); // Debugging: Log the request URL
    return fetch(url, {
        headers: {
            'Origin': 'https://kawacore.github.io',
            'x-requested-with': 'XMLHttpRequest'
        }
    })
    .then(response => {
        console.log('Raw response:', response); // Debugging: Log the raw response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Parsed data:', data); // Debugging: Log the parsed data
        if (!data.chart || !data.chart.result) {
            throw new Error('Invalid JSON structure');
        }
        const chartData = data.chart.result[0];
        const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000));
        const prices = chartData.indicators.quote[0].close;
        return { timestamps, prices };
    })
    .catch(error => {
        console.error('Error fetching stock data:', error);
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
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'S&P 500 (SPY)',
                        data: spyData.prices,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'auto' },
                        title: { display: true, text: 'Date' },
                    },
                    y: {
                        title: { display: true, text: 'Price (USD)' },
                    }
                },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }
};

// Update charts dynamically
const updateGraph = (range, interval) => {
    console.log('Updating graph with range:', range, 'and interval:', interval); // Debugging
    Promise.all([
        fetchStockData('URTH', range, interval),
        fetchStockData('SPY', range, interval)
    ])
    .then(([urthData, spyData]) => {
        createOrUpdateETFChart(urthData, spyData);
    })
    .catch(error => console.error('Error updating ETF chart:', error));
};

// Initialize with default range
document.addEventListener('DOMContentLoaded', () => {
    updateGraph('1y', '1wk'); // Default to 1 year
});
