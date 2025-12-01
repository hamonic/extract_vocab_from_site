function showText() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");

    if (text.trim() === "") {
        output.style.display = "none";
        return;
    }

    // Extract words
    const words = extractWords(text);

    output.style.display = "block";
    output.innerHTML = `
        <strong style="font-size:22px;">Original Text:</strong><br><br>
        <div style="color:#0066cc;">${text}</div>

        <hr style="margin:20px 0;">

        <strong style="font-size:22px;">Extracted Words (${words.length}):</strong><br><br>
        <div style="color:#0066cc; font-size:18px;">
            ${words.join(", ")}
        </div>
    `;
}

function extractWords(text) {
    // 1. Lowercase
    let cleaned = text.toLowerCase();

    // 2. Extract alphabetic words
    let words = cleaned.match(/[a-zA-Z']+/g) || [];

    // 3. Remove duplicates
    let unique = [...new Set(words)];

    // 4. Sort alphabetically
    unique.sort();

    return unique;
}

function clearAll() {
    // Clear input
    document.getElementById("inputText").value = "";

    // Clear output
    const output = document.getElementById("output");
    output.style.display = "none";
    output.innerHTML = "";
}
