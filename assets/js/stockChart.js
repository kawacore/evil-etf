const ctx = document.getElementById('stockChart').getContext('2d');

// Initialisieren des Graphen
const stockChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Zeitstempel (Daten)
        datasets: [{
            label: 'MSCI World (URTH)',
            data: [], // Kurse
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
        },
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

// Funktion zum Abrufen von Yahoo Finance-Daten
function fetchStockData() {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/URTH?range=1y&interval=1d";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const chartData = data.chart.result[0];
            const timestamps = chartData.timestamp;
            const prices = chartData.indicators.quote[0].close;

            // Graph-Daten aktualisieren
            stockChart.data.labels = timestamps.map(ts => new Date(ts * 1000));
            stockChart.data.datasets[0].data = prices;
            stockChart.update();
        })
        .catch(error => {
            console.error("Error fetching stock data:", error);
        });
}

// Daten abrufen, sobald die Seite geladen wird
fetchStockData();
