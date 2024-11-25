document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('stockChart').getContext('2d');

    // Funktion zum Abrufen der Daten von Yahoo Finance
    function fetchStockData() {
        const url = "https://query1.finance.yahoo.com/v8/finance/chart/URTH?range=1y&interval=1d";

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const chartData = data.chart.result[0];
                const timestamps = chartData.timestamp;
                const prices = chartData.indicators.quote[0].close;

                // Daten für den Graphen vorbereiten
                const labels = timestamps.map(ts => new Date(ts * 1000).toLocaleDateString());
                const dataset = prices;

                // Graphen erstellen
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'MSCI World (URTH)',
                            data: dataset,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.1,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: { display: true, text: 'Date' },
                            },
                            y: {
                                title: { display: true, text: 'Price (USD)' },
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching stock data:", error);
            });
    }

    // Daten abrufen und Graphen erstellen
    fetchStockData();
});
