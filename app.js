/*  
-----------------------------------------
  VOCAB EXTRACTION DISPLAY
-----------------------------------------
*/

function showExtractedWords() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");

    if (text.trim() === "") {
        output.style.display = "none";
        return;
    }

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
  GOOGLE LOGIN — NEW GIS TOKEN CLIENT
-----------------------------------------
*/

const CLIENT_ID = "346154006664-aabpfsd96cgacauqitpvkf0k55v4pm71.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let accessToken = null;

// Initialize later when user clicks login
window.onload = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            accessToken = response.access_token;
            alert("Google login successful!");
        }
    });
};

function googleLogin() {
    tokenClient.requestAccessToken();
}

/*  
-----------------------------------------
  GOOGLE SHEETS UPLOAD
-----------------------------------------
*/

async function uploadToGoogleSheet() {

    if (!accessToken) {
        alert("Please sign in with Google first.");
        return;
    }

    const sheetURL = document.getElementById("sheetURL").value.trim();
    const text = document.getElementById("inputText").value.trim();

    if (!sheetURL) {
        alert("Please paste your Google Sheet link.");
        return;
    }
    if (!text) {
        alert("Please enter some text.");
        return;
    }

    const sheetID = extractSheetID(sheetURL);
    if (!sheetID) {
        alert("Invalid Google Sheet link.");
        return;
    }

    const words = extractWords(text);

    // Authorize API client with token
    gapi.client.setToken({ access_token: accessToken });

    // Load Sheets API
    await gapi.client.load("sheets", "v4");

    // Read existing words from "data" tab
    let existing = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: "data!A2:A"
    });

    let oldWords = existing.result.values ? existing.result.values.flat() : [];

    // Filter new words
    let newWords = words.filter(w => !oldWords.includes(w));

    if (newWords.length === 0) {
        alert("No new words to upload!");
        return;
    }

    let today = new Date().toLocaleDateString();

    // Insert into vocab_check
    let rowsCheck = newWords.map(w => [w, "=TRUE", today]);

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: sheetID,
        range: "vocab_check!A2",
        valueInputOption: "USER_ENTERED",
        resource: { values: rowsCheck }
    });

    // Insert into data tab
    let rowsData = newWords.map(w => [w, today]);

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: sheetID,
        range: "data!A2",
        valueInputOption: "USER_ENTERED",
        resource: { values: rowsData }
    });

    alert("Upload complete! Added " + newWords.length + " new words.");
}

/*  
-----------------------------------------
  EXTRACT GOOGLE SHEET ID
-----------------------------------------
*/

function extractSheetID(url) {
    let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}
