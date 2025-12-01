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
  GOOGLE API INIT
-----------------------------------------
*/

const CLIENT_ID = "346154006664-aabpfsd96cgacauqitpvkf0k55v4pm71.apps.googleusercontent.com";
const API_KEY = ""; // not needed for Sheets write
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

function initGoogle() {
    gapi.load("client:auth2", () => {
        gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPES
        }).then(() => {
            gapi.auth2.getAuthInstance().signIn().then(() => {
                alert("Google Login Successful!");
            });
        });
    });
}

/*  
-----------------------------------------
  UPLOAD TO GOOGLE SHEET
-----------------------------------------
*/

async function uploadToGoogleSheet() {

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

    await gapi.client.load("sheets", "v4");

    // STEP 1 — Read "data" tab column A
    const existing = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: "data!A2:A"
    });

    let oldWords = existing.result.values ? existing.result.values.flat() : [];

    // STEP 2 — Filter new words
    let newWords = words.filter(w => !oldWords.includes(w));

    if (newWords.length === 0) {
        alert("No new words to upload!");
        return;
    }

    // STEP 3 — Insert into vocab_check (words + checkbox + date)
    let today = new Date().toLocaleDateString();
    let rows = newWords.map(w => [w, "=TRUE", today]);

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: sheetID,
        range: "vocab_check!A2",
        valueInputOption: "USER_ENTERED",
        resource: { values: rows }
    });

    // STEP 4 — Also append to data tab (for history)
    let dataRows = newWords.map(w => [w, today]);

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: sheetID,
        range: "data!A2",
        valueInputOption: "USER_ENTERED",
        resource: { values: dataRows }
    });

    alert("Upload complete! Added " + newWords.length + " new words.");
}

/*  
-----------------------------------------
  GOOGLE SHEET ID EXTRACTOR
-----------------------------------------
*/

function extractSheetID(url) {
    let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];

    match = url.match(/spreadsheets\/u\/\d\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];

    return null;
}
