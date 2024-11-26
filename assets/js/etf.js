const companies = [
    { name: "ExxonMobil", ticker: "XOM", weight: 0.20 }, // 20%
    { name: "BP", ticker: "BP", weight: 0.15 }, // 15%
    { name: "Chevron", ticker: "CVX", weight: 0.15 }, // 15%
    { name: "Gazprom", ticker: "GAZP.MM", weight: 0.10 }, // 10%
    { name: "Shell", ticker: "SHEL", weight: 0.10 }, // 10%
    { name: "Saudi Aramco", ticker: "2222.SR", weight: 0.10 }, // 10%
    { name: "Norilsk Nickel", ticker: "GMKN.MM", weight: 0.05 }, // 5%
    { name: "TotalEnergies", ticker: "TTE", weight: 0.05 }, // 5%
    { name: "Peabody Energy", ticker: "BTU", weight: 0.05 }, // 5%
    { name: "Rio Tinto", ticker: "RIO", weight: 0.05 } // 5%
];

// Populate ETF composition dynamically
const compositionList = document.getElementById('etf-composition');
companies.forEach(company => {
    const listItem = document.createElement('li');
    listItem.textContent = `${company.name} (${company.ticker}): ${(company.weight * 100).toFixed(1)}%`;
    compositionList.appendChild(listItem);
});

// Fetch stock data for all companies and calculate ETF performance
const fetchStockData = (symbol, range = '1y', interval = '1d') => {
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
        const prices = chartData.indicators.quote[0].close;
        return prices;
    });
};

// Calculate ETF price based on weighted sum of individual stock prices
const calculateETFPerformance = async () => {
    const range = '1y';
    const interval = '1d';
    const allPrices = await Promise.all(companies.map(company => fetchStockData(company.ticker, range, interval)));

    // Calculate weighted ETF prices
    const etfPrices = allPrices[0].map((_, index) => {
        return companies.reduce((total, company, i) => {
            return total + allPrices[i][index] * company.weight;
        }, 0);
    });

    return etfPrices;
};

// Render ETF performance chart
const renderETFPerformanceChart = async () => {
    const prices = await calculateETFPerformance();
    const ctx = document.getElementById('etfPerformanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: prices.length }, (_, i) => i), // Placeholder labels
            datasets: [{
                label: 'ETF Performance',
                data: prices,
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Days' },
                },
                y: {
                    title: { display: true, text: 'Price (USD)' },
                }
            }
        }
    });
};

renderETFPerformanceChart();
