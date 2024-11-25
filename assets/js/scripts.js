// Yahoo Finance API URL
const yahooFinanceApiUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";

// Element für den Börsenticker
const tickerElement = document.createElement("p");
tickerElement.id = "ticker";
tickerElement.textContent = "Loading stock price...";
companyDetails.appendChild(tickerElement);

// Funktion, um Live-Börsenkurse von Yahoo Finance abzurufen
function fetchStockPrice(symbol) {
    const url = `${yahooFinanceApiUrl}${symbol}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Preis aus der Antwort extrahieren
            const regularMarketPrice = data.chart.result[0].meta.regularMarketPrice;
            tickerElement.textContent = `Stock Price (${symbol}): $${regularMarketPrice}`;
        })
        .catch(error => {
            tickerElement.textContent = "Error fetching stock price.";
            console.error("Yahoo Finance API Error:", error);
        });
}

// Beim Anzeigen der Details wird der Börsenkurs abgerufen
function showDetails(company) {
    companyList.style.display = 'none';
    companyDetails.style.display = 'block';
    details.innerHTML = `
        <strong>Name:</strong> ${company.name}<br>
        <strong>Sector:</strong> ${company.sector}<br>
        <strong>Reason:</strong> <ul>${company.reason.map(r => `<li>${r}</li>`).join('')}</ul>
        <strong>ESG Score:</strong> ${company.esg_score}<br>
        <strong>Market Cap:</strong> ${company.market_cap}<br>
        <strong>Ticker:</strong> ${company.ticker}
    `;
    fetchStockPrice(company.ticker); // Börsenkurs abrufen
}

// Zurück zur Liste
function backToList() {
    companyList.style.display = 'block';
    companyDetails.style.display = 'none';
}
