// --- Configuration ---
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLjWs22_NQoMJ29umXzG4NtEYymEuECc6IPUsPpgJHZW2xPjpyghYDVA_Gkgsa851d0A/exec"; 
// ---------------------

// --- Get elements from the HTML ---
const joForm = document.getElementById("joForm");
const submitButton = document.getElementById("submitButton");
const messageDiv = document.getElementById("message");

// --- Add event listener to the form ---
joForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent default form submission

    // 1. Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Saving... Please wait...";
    messageDiv.textContent = "";

    // 2. Collect all data from the form
    const formData = {
        action: "createJobOrder", // This tells our Google Script what to do
        customerName: document.getElementById("customerName").value,
        customerContact: document.getElementById("customerContact").value,
        unitSerial: document.getElementById("unitSerial").value,
        unitModel: document.getElementById("unitModel").value,
        unitBrand: document.getElementById("unitBrand").value,
        warrantyType: document.getElementById("warrantyType").value,
        dateOfPurchase: document.getElementById("dateOfPurchase").value,
        problemReported: document.getElementById("problemReported").value,
        receiptLink: document.getElementById("receiptLink").value,
        proofLink: document.getElementById("proofLink").value
    };

    // 3. Send the data to Google Apps Script
    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "cors", // Required for cross-origin requests
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        // 4. Handle the response
        if(data.status === "success") {
            // SUCCESS!
            const newID = data.data.newJobID;
            messageDiv.textContent = `Success! New Job Order Created: JO# ${newID}`;
            messageDiv.style.color = "green";
            joForm.reset(); // Clear the form
        } else {
            // ERROR!
            throw new Error(data.message || "Unknown error occurred.");
        }
    })
    .catch(error => {
        // 4b. Handle fetch error
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = "red";
    })
    .finally(() => {
        // 5. Reset button state
        submitButton.disabled = false;
        submitButton.textContent = "Create Job Order";
    });
});