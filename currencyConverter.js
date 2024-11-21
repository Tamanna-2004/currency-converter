// Base URL for the exchange rate API
let BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

// Select all the dropdown elements
let dropdowns = document.querySelectorAll('.dropdown select');

// Function to update the flag image based on the selected currency
const updateImage = (element) => {
    let currCode = element.value; // Get the selected currency code
    let countryCode = countryList[currCode]; // Get the corresponding country code
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // Construct the URL for the flag image
    let img = element.parentElement.querySelector("img"); // Find the image element within the same parent
    img.src = newsrc; // Update the image source to the new URL
};

// Function to fetch and display the conversion rate
const fetchConversion = async () => {
    let amount = document.querySelector(".amount input"); // Get the input element for the amount
    let amountVal = amount.value; // Get the value entered by the user
    let fromCurr = document.querySelector('.from select'); // 'From' currency dropdown
    let toCurr = document.querySelector('.to select'); // 'To' currency dropdown
    let msg = document.querySelector('.msg'); // Message display area

    // Set the amount to 1 if the input is empty or less than 1
    if (amountVal === "" || amountVal < 1) {
        amountVal = 1;
        amount.value = "1";
    }

    try {
        // Build the API request URL with the selected 'from' currency
        const URL = `${BASE_URL}${fromCurr.value}`;
        let response = await fetch(URL); // Fetch data from the API
        let data = await response.json(); // Parse the response JSON
        let rate = data.rates[toCurr.value]; // Get the exchange rate for the 'to' currency

        // If the exchange rate is found, calculate and display the converted amount
        if (rate) {
            let finalAmount = (amountVal * rate).toFixed(2); // Calculate the converted amount and format it to 2 decimal places
            msg.innerHTML = `${amountVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`; // Display the result
        } else {
            msg.innerHTML = `Exchange rate not found for ${fromCurr.value} to ${toCurr.value}.`; // Handle the case where the exchange rate is not available
        }
    } catch (error) {
        // Handle errors by displaying a message and logging the error
        msg.innerHTML = "Failed to fetch exchange rate. Please try again.";
        console.error(error);
    }
};

// Loop through each dropdown select element
for (let select of dropdowns) {
    // Loop through each currency code in the country list
    for (let currCode in countryList) {
        // Create a new option element for each currency code
        let newOption = document.createElement("option");
        newOption.innerHTML = currCode; // Set the option text to the currency code
        newOption.value = currCode; // Set the option value to the currency code

        // Set default selection for the 'from' dropdown to USD
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        }
        // Set default selection for the 'to' dropdown to INR
        if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        // Append the new option to the select element
        select.append(newOption);
    }

    // Add an event listener to update the flag image when the currency is changed
    select.addEventListener("change", (e) => {
        updateImage(e.target);
        fetchConversion(); // Fetch conversion when currency selection changes
    });
}

// Perform the initial conversion on page load
fetchConversion();
