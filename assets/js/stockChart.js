// Function to update the main stock chart
function updateGraph(range, interval) {
    const symbols = ['URTH', 'SPY'];
    const promises = symbols.map(symbol => fetchStockData(symbol, range, interval));

    Promise.all(promises)
        .then(datasets => {
            const ctx = document.getElementById('stockChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Price (USD)'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error updating graph:', error));
}

// Function to fetch stock data
function fetchStockData(symbol, range, interval) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const chartData = data.chart.result[0];
            const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000));
            const prices = chartData.indicators.quote[0].close;

            return {
                label: symbol,
                data: timestamps.map((time, index) => ({
                    x: time,
                    y: prices[index]
                })),
                borderColor: symbol === 'URTH' ? 'blue' : 'green',
                backgroundColor: symbol === 'URTH' ? 'rgba(0, 0, 255, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                tension: 0.1
            };
        })
        .catch(error => console.error('Error fetching stock data:', error));
}

// Initialize the graph with default parameters
document.addEventListener('DOMContentLoaded', () => {
    updateGraph('1y', '1d');
});
