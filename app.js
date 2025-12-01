function showText() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");

    if (text.trim() === "") {
        output.style.display = "none";
        return;
    }

    output.style.display = "block";
    output.innerHTML = `
        <strong style="color:#333; font-size:22px;">Your Input:</strong><br><br>
        <span style="color:#0066cc;">${text}</span>
    `;
}

function extractVocabulary() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");

    if (text.trim() === "") {
        output.style.display = "none";
        return;
    }

    // 1. Lowercase
    let cleaned = text.toLowerCase();

    // 2. Extract alphabetic words
    let words = cleaned.match(/[a-zA-Z']+/g) || [];

    // 3. Remove duplicates
    let unique = [...new Set(words)];

    // 4. Sort alphabetically
    unique.sort();

    // 5. Display result
    output.style.display = "block";
    output.innerHTML = `
        <strong style="font-size:22px;">Extracted Vocabulary (${unique.length} words):</strong>
        <br><br>
        <div style="color:#0066cc; font-size:18px;">${unique.join(", ")}</div>
    `;
}
