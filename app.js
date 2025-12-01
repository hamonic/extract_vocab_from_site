function showText() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");

    if (text.trim() === "") {
        output.style.display = "none";
        return;
    }

    // Make output visible
    output.style.display = "block";

    // Decorate the text a little (make it bigger & colored)
    output.innerHTML = `
        <strong style="color: #333; font-size: 22px;">Your Input:</strong><br><br>
        <span style="color: #0066cc;">${text}</span>
    `;
}
