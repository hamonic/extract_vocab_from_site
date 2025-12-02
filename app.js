
const CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

function extractWords(text) {
    return [...new Set(
        text
            .toLowerCase()
            .match(/\b[a-zA-Z]+\b/g) || []
    )];
}

/*
function initGoogle() {
    gapi.load("client:auth2", async () => {
        await gapi.client.init({
            clientId: CLIENT_ID,
            scope: SCOPES
        });

        const auth = gapi.auth2.getAuthInstance();

        auth.signIn().then(() => {
            alert("Google Login Successful!");
        }).catch(err => {
            console.error("SIGN-IN ERROR:", err);
        });
    });
}
/*

function initGoogle() {
  google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
      console.log("Google Login Success", tokenResponse);
      alert("Google Login Successful!");
    }
  }).requestAccessToken();
}



async function uploadToGoogleSheet() {
    try {
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

        await gapi.client.load("sheets", "v4");

        const words = extractWords(text);

        const existing = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetID,
            range: "data!A2:A"
        });

        let oldWords = existing.result.values ? existing.result.values.flat() : [];
        let newWords = words.filter(w => !oldWords.includes(w));

        if (newWords.length === 0) {
            alert("No new words to upload!");
            return;
        }

        let today = new Date().toLocaleDateString();
        let rows = newWords.map(w => [w, "=TRUE", today]);

        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: sheetID,
            range: "vocab_check!A2",
            valueInputOption: "USER_ENTERED",
            resource: { values: rows }
        });

        let dataRows = newWords.map(w => [w, today]);

        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: sheetID,
            range: "data!A2",
            valueInputOption: "USER_ENTERED",
            resource: { values: dataRows }
        });

        alert("Upload complete! Added " + newWords.length + " new words.");

    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        alert("Google Sheets upload failed. See console.");
    }
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



