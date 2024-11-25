// Elemente referenzieren
const companyList = document.getElementById("companies");
const companyDetails = document.getElementById("company-details");
const details = document.getElementById("details");

// Unternehmen laden und anzeigen
fetch('./data/companies/exxonmobil.json')
    .then(response => response.json())
    .then(data => {
        const listItem = document.createElement('li');
        listItem.textContent = data.name;
        listItem.onclick = () => showDetails(data);
        companyList.appendChild(listItem);
    });

// Details eines Unternehmens anzeigen
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
}

// Zurück zur Liste
function backToList() {
    companyList.style.display = 'block';
    companyDetails.style.display = 'none';
}
