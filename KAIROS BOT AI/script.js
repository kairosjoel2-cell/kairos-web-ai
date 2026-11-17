
// ==========================================
// KAIROS WEB AI
// Main JavaScript
// ==========================================

const websitePrompt = document.getElementById("websitePrompt");
const websiteType = document.getElementById("websiteType");
const generateBtn = document.getElementById("generateBtn");

const websitePreview = document.getElementById("websitePreview");
const codeEditor = document.getElementById("codeEditor");

const desktopBtn = document.getElementById("desktopBtn");
const mobileBtn = document.getElementById("mobileBtn");

const visualEditBtn = document.getElementById("visualEditBtn");
const applyCodeBtn = document.getElementById("applyCodeBtn");

const codeTabs = document.querySelectorAll(".code-tab");


// ==========================================
// WEBSITE CODE STORAGE
// ==========================================

let websiteCode = {
    html: "",
    css: "",
    js: ""
};

let activeCode = "html";
let visualEditing = false;


// ==========================================
// INITIAL PREVIEW
// ==========================================

function showWelcomePage() {

    const welcomeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                min-height: 100vh;
                display: grid;
                place-items: center;
                font-family: Arial, sans-serif;
                background: #f5f6fa;
                color: #242a38;
                text-align: center;
                padding: 20px;
            }

            h1 {
                font-size: 30px;
                margin-bottom: 10px;
            }

            p {
                color: #778094;
                line-height: 1.7;
            }

            .symbol {
                font-size: 45px;
            }
        </style>
    </head>

    <body>
        <div>
            <div class="symbol">✦</div>
            <h1>Your website starts here.</h1>
            <p>Describe your idea above and generate your first website with KAIROS WEB AI.</p>
        </div>
    </body>
    </html>
    `;

    websitePreview.srcdoc = welcomeHTML;
}

showWelcomePage();


// ==========================================
// CODE EDITOR
// ==========================================

function loadCodeEditor() {
    codeEditor.value = websiteCode[activeCode];
}

codeTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        codeTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        // Save current editor content before switching
        websiteCode[activeCode] = codeEditor.value;

        activeCode = tab.dataset.code;

        loadCodeEditor();

    });

});


// ==========================================
// APPLY CODE CHANGES
// ==========================================

function buildWebsite() {

    // Save the current editor content
    websiteCode[activeCode] = codeEditor.value;

    const completeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <style>
            ${websiteCode.css}
        </style>

    </head>

    <body>

        ${websiteCode.html}

        <script>
            ${websiteCode.js}
        <\/script>

    </body>
    </html>
    `;

    websitePreview.srcdoc = completeHTML;
}

applyCodeBtn.addEventListener("click", () => {

    buildWebsite();

    alert("Website changes applied successfully!");

});


// ==========================================
// DESKTOP PREVIEW
// ==========================================

desktopBtn.addEventListener("click", () => {

    websitePreview.classList.remove("mobile");

    desktopBtn.classList.add("active");
    mobileBtn.classList.remove("active");

});


// ==========================================
// MOBILE PREVIEW
// ==========================================

mobileBtn.addEventListener("click", () => {

    websitePreview.classList.add("mobile");

    mobileBtn.classList.add("active");
    desktopBtn.classList.remove("active");

});


// ==========================================
// VISUAL EDITING MODE
// ==========================================

visualEditBtn.addEventListener("click", () => {

    if (!websiteCode.html) {
        alert("Generate a website first!");
        return;
    }

    visualEditing = !visualEditing;

    if (visualEditing) {

        visualEditBtn.textContent = "✕ Exit Visual Edit";

        alert(
            "Visual editing mode enabled. Click Apply Changes after editing your code."
        );

    } else {

        visualEditBtn.textContent = "✎ Visual Edit";

    }

});


// ==========================================
// GENERATION PLACEHOLDER
// ==========================================

generateBtn.addEventListener("click", () => {

    const prompt = websitePrompt.value.trim();

    if (!prompt) {
        alert("Please describe the website you want to create.");
        return;
    }

    alert(
        "Your website prompt has been received. The AI API connection is the next step."
    );

});


// ==========================================
// KEYBOARD SHORTCUT
// ==========================================

codeEditor.addEventListener("keydown", event => {

    if (event.key === "Tab") {

        event.preventDefault();

        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;

        codeEditor.value =
            codeEditor.value.substring(0, start) +
            "  " +
            codeEditor.value.substring(end);

        codeEditor.selectionStart =
            codeEditor.selectionEnd = start + 2;

    }

});

console.log("KAIROS WEB AI initialized successfully.");
