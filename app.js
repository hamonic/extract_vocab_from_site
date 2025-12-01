/*  
-----------------------------------------
  DISPLAY EXTRACTED WORDS
-----------------------------------------
*/

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

/*  
-----------------------------------------
  WORD EXTRACTION LOGIC
-----------------------------------------
*/

function extractWords(text) {
    let cleaned = text.toLowerCase();
    let words = cleaned.match(/[a-zA-Z']+/g) || [];
    let unique = [...new Set(words)];
    unique.sort();
    return unique;
}

/*  
-----------------------------------------
  CLEAR INPUT AND OUTPUT
-----------------------------------------
*/

function clearAll() {
    document.getElementById("inputText").value = "";
    const output = document.getElementById("output");
    output.style.display = "none";
    output.innerHTML = "";
}

/*  
-----------------------------------------
  GOOGLE SHEETS INTEGRATION (STRUCTURE)
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
        alert("Invalid Google Sheet link. Cannot extract Sheet ID.");
        return;
    }

    // Placeholder — real Google API code will be added soon
    console.log("Sheet ID extracted:", sheetID);
    console.log("Words to upload:", words);

    alert("Google Sheets upload module initialized. Waiting for API integration.");
}

/*  
-----------------------------------------
  UPDATED GOOGLE SHEET ID EXTRACTOR
-----------------------------------------
*/

function extractSheetID(url) {

    // Standard pattern: /d/<ID>/
    let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];

    // Rare mobile/alternate format: /spreadsheets/u/0/d/<ID>/
    match = url.match(/spreadsheets\/u\/\d\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];

    return null;
}
