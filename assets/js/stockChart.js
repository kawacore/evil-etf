let stockChart; // Reference for the ETF chart

// Helper function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fetch stock data for a single company
const fetchStockData = async (symbol, range, interval, delayMs = 0) => {
    const url = `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    console.log('Request URL:', url); // Debugging: Log the request URL
    await delay(delayMs); // Apply delay before making the API call
    try {
        const response = await fetch(url, {
            headers: {
                'Origin': 'https://kawacore.github.io',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        console.log('Raw response:', response); // Debugging: Log the raw response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed data:', data); // Debugging: Log the parsed data
        if (!data.chart || !data.chart.result) {
            throw new Error('Invalid JSON structure');
        }
        const chartData = data.chart.result[0];
        const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000));
        const prices = chartData.indicators.quote[0].close;
        return { timestamps, prices };
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null; // Return null if there's an error
    }
};

// Update ETF chart (main graph)
const createOrUpdateETFChart = (urthData, spyData) => {
    if (!urthData || !spyData) {
        console.error('Data is missing for one or both datasets. Skipping chart update.');
        return;
    }
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

// Update charts dynamically with delays between requests
const updateGraph = async (range, interval) => {
    console.log('Updating graph with range:', range, 'and interval:', interval); // Debugging
    const urthData = await fetchStockData('URTH', range, interval, 0); // No delay for first call
    const spyData = await fetchStockData('SPY', range, interval, 1000); // 1-second delay for second call
    createOrUpdateETFChart(urthData, spyData);
};

// Initialize with default range
document.addEventListener('DOMContentLoaded', () => {
    updateGraph('1y', '1wk'); // Default to 1 year
});
