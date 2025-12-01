function showExtractedWords() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");

    if (text.trim() === "") {
        output.style.display = "none";
        return;
    }

    // Extract unique sorted vocabulary
    const words = extractWords(text);

    output.style.display = "block";
    output.innerHTML = `
        <strong style="font-size:22px;">Extracted Words (${words.length}):</strong><br><br>
        <div style="color:#0066cc; font-size:18px;">
            ${words.join(", ")}
        </div>
    `;
}

function extractWords(text) {
    let cleaned = text.toLowerCase();
    let words = cleaned.match(/[a-zA-Z']+/g) || [];
    let unique = [...new Set(words)];
    unique.sort();
    return unique;
}

function clearAll() {
    document.getElementById("inputText").value = "";
    const output = document.getElementById("output");
    output.style.display = "none";
    output.innerHTML = "";
}

/*  
-----------------------------------------
 GOOGLE SHEETS INTEGRATION (PHASE 2)
-----------------------------------------
*/

// Main entry point for Google Sheets upload
async function uploadToGoogleSheet() {

    const sheetURL = document.getElementById("sheetURL").value.trim();
    const text = document.getElementById("inputText").value.trim();

    if (!sheetURL) {
        alert("Please paste your Google Sheet link first.");
        return;
    }

    if (!text) {
        alert("Please enter some text before uploading.");
        return;
    }

    // Extract words
    const words = extractWords(text);

    // Convert URL → Sheet ID
    const sheetID = extractSheetID(sheetURL);

    if (!sheetID) {
        alert("Invalid Google Sheet link.");
        return;
    }

    // Placeholder — next step we add real Google API calls
    console.log("Sheet ID:", sheetID);
    console.log("Words to upload:", words);

    alert("Google Sheets upload module initialized. Waiting for API integration.");
}

// Extract sheet ID from full URL
function extractSheetID(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}
