// ==========================================
// AIVORA AI - MAIN APP.JS
// ==========================================


// ==========================================
// CONFIG
// ==========================================

const AI_WORKER_URL =
    "https://chataivora-ai.amanmaurya5172.workers.dev/api/chat";

const HISTORY_KEY = "aivora_chat_history";
const CHATS_KEY = "aivora_all_chats";
const THEME_KEY = "aivora_theme";
const LANGUAGE_KEY = "aivora_language";

const PROFILE_NAME_KEY =
    "aivora_profile_name";

const PROFILE_IMAGE_KEY =
    "aivora_profile_image";

const AUTH_USER_KEY =
    "aivora_user";

let currentChatId =
    Date.now().toString();

let recognition = null;


// ==========================================
// ELEMENTS
// ==========================================

const input =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const chatBox =
    document.getElementById("chatBox");

const welcome =
    document.getElementById("welcome");

const newChatBtn =
    document.getElementById("newChatBtn");

const sidebarNewChatBtn =
    document.getElementById(
        "sidebarNewChatBtn"
    );

const menuBtn =
    document.getElementById("menuBtn");

const chatSidebar =
    document.getElementById(
        "chatSidebar"
    );

const chatHistory =
    document.getElementById(
        "chatHistory"
    );

const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById(
        "searchInput"
    );

const closeSearchBtn =
    document.getElementById(
        "closeSearchBtn"
    );

const clearChatBtn =
    document.getElementById(
        "clearChatBtn"
    );

const voiceBtn =
    document.getElementById("voiceBtn");

const attachBtn =
    document.getElementById("attachBtn");

const fileInput =
    document.getElementById("fileInput");


// ==========================================
// PROFILE ELEMENTS
// ==========================================

const profileBtn =
    document.getElementById(
        "profileBtn"
    );

const sidebarProfileBtn =
    document.getElementById(
        "sidebarProfileBtn"
    );

const profileOverlay =
    document.getElementById(
        "profileOverlay"
    );

const closeProfileBtn =
    document.getElementById(
        "closeProfileBtn"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const changePhotoBtn =
    document.getElementById(
        "changePhotoBtn"
    );

const profileImageInput =
    document.getElementById(
        "profileImageInput"
    );

const saveProfileBtn =
    document.getElementById(
        "saveProfileBtn"
    );

const openLoginBtn =
    document.getElementById(
        "openLoginBtn"
    );


// ==========================================
// SETTINGS
// ==========================================

const themeBtn =
    document.getElementById("themeBtn");

const settingsBtn =
    document.getElementById(
        "settingsBtn"
    );

const sidebarSettingsBtn =
    document.getElementById(
        "sidebarSettingsBtn"
    );

const settingsOverlay =
    document.getElementById(
        "settingsOverlay"
    );

const closeSettingsBtn =
    document.getElementById(
        "closeSettingsBtn"
    );

const settingsThemeBtn =
    document.getElementById(
        "settingsThemeBtn"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );



// ==========================================
// LOGIN / SIGNUP - D1 DATABASE
// ==========================================

const AUTH_API =
    "https://chataivora-ai.amanmaurya5172.workers.dev/api/auth";


// ==========================================
// SHOW SIGNUP
// ==========================================

if (showSignupBtn) {

    showSignupBtn.addEventListener(
        "click",
        function () {

            loginForm.style.display = "none";
            signupForm.style.display = "block";

        }
    );

}


// ==========================================
// SHOW LOGIN
// ==========================================

if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        function () {

            signupForm.style.display = "none";
            loginForm.style.display = "block";

        }
    );

}


// ==========================================
// SIGNUP
// ==========================================

if (signupBtn) {

    signupBtn.addEventListener(
        "click",
        async function () {

            const name =
                signupName.value.trim();

            const email =
                signupEmail.value.trim().toLowerCase();

            const password =
                signupPassword.value;


            if (!name || !email || !password) {

                alert(
                    "कृपया सभी जानकारी भरें।"
                );

                return;

            }


            if (password.length < 6) {

                alert(
                    "Password कम से कम 6 characters का होना चाहिए।"
                );

                return;

            }


            signupBtn.disabled = true;

            const oldText =
                signupBtn.textContent;

            signupBtn.textContent =
                "Creating...";


            try {

                const response =
                    await fetch(
                        `${AUTH_API}/signup`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.error ||
                        "Account creation failed"
                    );

                }


                // SAFE USER DATA ONLY
                localStorage.setItem(
                    AUTH_USER_KEY,
                    JSON.stringify({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email
                    })
                );


                alert(
                    "Account बन गया! ✅"
                );


                signupForm.style.display =
                    "none";

                loginForm.style.display =
                    "block";

                loginEmail.value =
                    email;

                loginPassword.value =
                    "";


            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                alert(
                    error.message ||
                    "Account create नहीं हो पाया।"
                );

            } finally {

                signupBtn.disabled =
                    false;

                signupBtn.textContent =
                    oldText;

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async function () {

            const email =
                loginEmail.value.trim().toLowerCase();

            const password =
                loginPassword.value;


            if (!email || !password) {

                alert(
                    "Email और Password भरें।"
                );

                return;

            }


            loginBtn.disabled = true;

            const oldText =
                loginBtn.textContent;

            loginBtn.textContent =
                "Logging in...";


            try {

                const response =
                    await fetch(
                        `${AUTH_API}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.error ||
                        "Login failed"
                    );

                }


                // SAFE USER DATA ONLY
                localStorage.setItem(
                    AUTH_USER_KEY,
                    JSON.stringify({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email
                    })
                );


                alert(
                    "Login successful! ✅"
                );


                if (authOverlay) {

                    authOverlay.classList.remove(
                        "show"
                    );

                }


                // UPDATE PROFILE

                if (profileName) {

                    profileName.value =
                        data.user.name;

                }


                if (profileAvatar) {

                    const savedImage =
                        localStorage.getItem(
                            PROFILE_IMAGE_KEY
                        );

                    if (!savedImage) {

                        profileAvatar.textContent =
                            data.user.name
                                .charAt(0)
                                .toUpperCase();

                    }

                }


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    error.message ||
                    "Login नहीं हो पाया।"
                );

            } finally {

                loginBtn.disabled =
                    false;

                loginBtn.textContent =
                    oldText;

            }

        }
    );

}


// ==========================================
// CLOSE LOGIN / SIGNUP
// ==========================================

if (closeAuthBtn) {

    closeAuthBtn.addEventListener(
        "click",
        function () {

            if (authOverlay) {

                authOverlay.classList.remove(
                    "show"
                );

            }

        }
    );

}


// ==========================================
// OPEN LOGIN
// ==========================================

if (openLoginBtn) {

    openLoginBtn.addEventListener(
        "click",
        function () {

            if (profileOverlay) {

                profileOverlay.classList.remove(
                    "show"
                );

            }


            if (authOverlay) {

                authOverlay.classList.add(
                    "show"
                );

            }

        }
    );

}
// ==========================================
// AIVORA MARKDOWN RENDERER
// ==========================================

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatAIMessage(text) {

    // ======================================
    // ESCAPE HTML
    // ======================================

    let html = escapeHTML(text);

    const codeBlocks = [];

    // ======================================
    // SAVE CODE BLOCKS
    // ======================================

    html = html.replace(
        /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g,
        function (_, language, code) {

            const index = codeBlocks.length;

            codeBlocks.push({
                language: language || "",
                code: code.trim()
            });

            return `@@AIVORA_CODE_${index}@@`;
        }
    );


    // ======================================
    // INLINE CODE
    // ======================================

    html = html.replace(
        /`([^`\n]+)`/g,
        "<code>$1</code>"
    );


    // ======================================
    // BOLD
    // ======================================

    html = html.replace(
        /\*\*(.+?)\*\*/g,
        "<strong>$1</strong>"
    );


    // ======================================
    // ITALIC
    // ======================================

    html = html.replace(
        /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
        "<em>$1</em>"
    );


    // ======================================
    // SPLIT INTO LINES
    // ======================================

    const lines = html.split("\n");

    let result = "";
    let inUl = false;
    let inOl = false;


    // ======================================
    // PROCESS EVERY LINE
    // ======================================

    lines.forEach(function (line) {

        const trimmed = line.trim();


        // EMPTY LINE

        if (!trimmed) {

            if (inUl) {
                result += "</ul>";
                inUl = false;
            }

            if (inOl) {
                result += "</ol>";
                inOl = false;
            }

            return;
        }


        // H1

        if (/^# (.+)/.test(trimmed)) {

            if (inUl) {
                result += "</ul>";
                inUl = false;
            }

            if (inOl) {
                result += "</ol>";
                inOl = false;
            }

            result +=
                "<h1>" +
                trimmed.replace(/^# /, "") +
                "</h1>";

            return;
        }


        // H2

        if (/^## (.+)/.test(trimmed)) {

            if (inUl) {
                result += "</ul>";
                inUl = false;
            }

            if (inOl) {
                result += "</ol>";
                inOl = false;
            }

            result +=
                "<h2>" +
                trimmed.replace(/^## /, "") +
                "</h2>";

            return;
        }


        // H3

        if (/^### (.+)/.test(trimmed)) {

            if (inUl) {
                result += "</ul>";
                inUl = false;
            }

            if (inOl) {
                result += "</ol>";
                inOl = false;
            }

            result +=
                "<h3>" +
                trimmed.replace(/^### /, "") +
                "</h3>";

            return;
        }


        // BULLET LIST

        if (/^[-*] (.+)/.test(trimmed)) {

            if (inOl) {
                result += "</ol>";
                inOl = false;
            }

            if (!inUl) {
                result += "<ul>";
                inUl = true;
            }

            result +=
                "<li>" +
                trimmed.replace(/^[-*] /, "") +
                "</li>";

            return;
        }


        // NUMBERED LIST

        if (/^\d+\. (.+)/.test(trimmed)) {

            if (inUl) {
                result += "</ul>";
                inUl = false;
            }

            if (!inOl) {
                result += "<ol>";
                inOl = true;
            }

            result +=
                "<li>" +
                trimmed.replace(/^\d+\. /, "") +
                "</li>";

            return;
        }


        // CLOSE LISTS

        if (inUl) {
            result += "</ul>";
            inUl = false;
        }

        if (inOl) {
            result += "</ol>";
            inOl = false;
        }


        // CODE PLACEHOLDER

        if (/^@@AIVORA_CODE_\d+@@$/.test(trimmed)) {

            result += trimmed;

            return;
        }


        // NORMAL PARAGRAPH

        result +=
            "<p>" +
            trimmed +
            "</p>";

    });


    // ======================================
    // CLOSE OPEN LISTS
    // ======================================

    if (inUl) {
        result += "</ul>";
    }

    if (inOl) {
        result += "</ol>";
    }


    // ======================================
    // RESTORE CODE BLOCKS
    // ======================================

    codeBlocks.forEach(
        function (block, index) {

            const language = block.language
                ? `<span class="code-language">${block.language}</span>`
                : "";

            const codeHTML = `
                <div class="aivora-code-wrapper">
                    <div class="aivora-code-header">
                        ${language}

                        <button
                            type="button"
                            class="code-copy-btn"
                            data-code="${encodeURIComponent(block.code)}"
                        >
                            Copy
                        </button>
                    </div>

                    <pre><code>${block.code}</code></pre>
                </div>
            `;

            result = result.replace(
                `@@AIVORA_CODE_${index}@@`,
                codeHTML
            );

        }
    );


    return result;
}
// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(text, type) {

    if (!chatBox) return;

    const wrapper =
        document.createElement("div");

    wrapper.className =
        type === "user"
            ? "message-wrapper user-wrapper"
            : "message-wrapper ai-wrapper";


    const message =
        document.createElement("div");

    message.className =
        type === "user"
            ? "message user-message"
            : "message ai-message";

    if (type === "ai") {
    message.innerHTML =
        formatAIMessage(text);
} else {
    message.textContent = text;
}

    wrapper.appendChild(message);

// ======================================
// CODE COPY BUTTONS
// ======================================

if (type === "ai") {

    message
        .querySelectorAll(".code-copy-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async function () {

                    try {

                        const code =
                            decodeURIComponent(
                                button.dataset.code
                            );

                        await navigator
                            .clipboard
                            .writeText(code);

                        button.textContent =
                            "Copied!";

                        setTimeout(() => {

                            button.textContent =
                                "Copy";

                        }, 1200);

                    } catch (error) {

                        console.error(
                            "Code copy error:",
                            error
                        );

                    }

                }
            );

        });

}
    // ======================================
    // AI ACTION BUTTONS
    // ======================================

    if (type === "ai") {

        const actions =
            document.createElement("div");

        actions.className =
            "message-actions";


        // COPY

        const copyBtn =
            document.createElement("button");

        copyBtn.type = "button";
        copyBtn.title = "Copy";

        copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <rect x="9" y="9"
                width="11"
                height="11"
                rx="2"></rect>

            <path d="
                M5 15H4
                a2 2 0 0 1-2-2
                V4
                a2 2 0 0 1 2-2
                h9
                a2 2 0 0 1 2 2v1
            "></path>
        </svg>
        `;

        copyBtn.addEventListener(
            "click",
            async function () {

                try {

                    await navigator.clipboard
                        .writeText(text);

                    copyBtn.classList.add(
                        "active"
                    );

                    setTimeout(() => {

                        copyBtn.classList.remove(
                            "active"
                        );

                    }, 1000);

                } catch (error) {

                    console.error(
                        "Copy error:",
                        error
                    );

                }

            }
        );


        // LIKE

        const likeBtn =
            document.createElement("button");

        likeBtn.type = "button";
        likeBtn.title = "Like";

        likeBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="
                M7 10v10
                H4
                a2 2 0 0 1-2-2
                v-6
                a2 2 0 0 1 2-2h3Z
            "></path>

            <path d="
                M7 20h9.5
                a2 2 0 0 0 1.9-1.4
                l2-6
                A2 2 0 0 0 18.5 10
                H14
                l.8-4
                A3 3 0 0 0 12 2.5
                L7 10v10Z
            "></path>
        </svg>
        `;

        likeBtn.onclick =
            function () {

                likeBtn.classList.toggle(
                    "active"
                );

                dislikeBtn.classList.remove(
                    "active"
                );

            };


        // DISLIKE

        const dislikeBtn =
            document.createElement("button");

        dislikeBtn.type = "button";
        dislikeBtn.title = "Dislike";

        dislikeBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="
                M7 14V4
                H4
                a2 2 0 0 0-2 2
                v6
                a2 2 0 0 0 2 2h3Z
            "></path>

            <path d="
                M7 4h9.5
                a2 2 0 0 1 1.9 1.4
                l2 6
                A2 2 0 0 1 18.5 14
                H14
                l.8 4
                A3 3 0 0 1 12 21.5
                L7 14V4Z
            "></path>
        </svg>
        `;

        dislikeBtn.onclick =
            function () {

                dislikeBtn.classList.toggle(
                    "active"
                );

                likeBtn.classList.remove(
                    "active"
                );

            };


        // READ ALOUD

        const soundBtn =
            document.createElement("button");

        soundBtn.type = "button";
        soundBtn.title =
            "Read aloud";

        soundBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="
                M11 5
                L6 9
                H2
                v6h4
                l5 4V5Z
            "></path>

            <path d="
                M15.5 8.5
                a5 5 0 0 1 0 7
            "></path>

            <path d="
                M18.5 5.5
                a9 9 0 0 1 0 13
            "></path>
        </svg>
        `;

        soundBtn.onclick =
            function () {

                if (
                    !(
                        "speechSynthesis"
                        in window
                    )
                ) {

                    alert(
                        "Read aloud supported नहीं है।"
                    );

                    return;

                }

                speechSynthesis.cancel();

                const speech =
                    new SpeechSynthesisUtterance(
                        text
                    );

                speech.lang =
                    languageSelect &&
                    languageSelect.value === "en"
                        ? "en-US"
                        : "hi-IN";

                speech.rate = 1;

                speechSynthesis.speak(
                    speech
                );

            };


        // REGENERATE

        const regenerateBtn =
            document.createElement("button");

        regenerateBtn.type = "button";
        regenerateBtn.title =
            "Regenerate";

        regenerateBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="
                M20 11
                a8 8 0 0 0-14.9-4
                L3 10
            "></path>

            <path d="
                M3 5v5h5
            "></path>

            <path d="
                M4 13
                a8 8 0 0 0 14.9 4
                L21 14
            "></path>

            <path d="
                M21 19v-5h-5
            "></path>
        </svg>
        `;

        regenerateBtn.onclick =
            function () {

                const users =
                    chatBox.querySelectorAll(
                        ".user-message"
                    );

                if (!users.length) {
                    return;
                }

                const lastUser =
                    users[
                        users.length - 1
                    ];

                input.value =
                    lastUser.textContent;

                sendMessage(true);

            };


        actions.appendChild(
            copyBtn
        );

        actions.appendChild(
            likeBtn
        );

        actions.appendChild(
            dislikeBtn
        );

        actions.appendChild(
            soundBtn
        );

        actions.appendChild(
            regenerateBtn
        );

        wrapper.appendChild(
            actions
        );

    }


    chatBox.appendChild(
        wrapper
    );


    wrapper.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

}


// ==========================================
// GET CONVERSATION
// ==========================================

function getConversationMessages() {

    const messages = [];

    if (!chatBox) {
        return messages;
    }

    chatBox
        .querySelectorAll(".message")
        .forEach(message => {

            if (
                message.dataset.loading ===
                "true"
            ) {
                return;
            }

            const role =
                message.classList.contains(
                    "user-message"
                )
                    ? "user"
                    : "assistant";

            messages.push({
                role: role,
                content:
                    message.textContent
            });

        });

    // बहुत ज्यादा history API को नहीं भेजेंगे

    return messages.slice(-20);

}


// ==========================================
// SEND MESSAGE TO AI
// ==========================================

async function sendMessage(
    isRegenerate = false
) {

    if (!input) return;

    const text =
        input.value.trim();

    if (!text) return;


    // Welcome hide

    if (welcome) {
        welcome.style.display =
            "none";
    }


    // Regenerate में नया user
    // message दोबारा नहीं दिखाना

    if (!isRegenerate) {

        addMessage(
            text,
            "user"
        );

    }


    input.value = "";

    saveChat();


    // Disable button

    if (sendBtn) {
        sendBtn.disabled = true;
    }


    // ======================================
    // LOADING MESSAGE
    // ======================================

    const loadingWrapper =
        document.createElement("div");

    loadingWrapper.className =
        "message-wrapper ai-wrapper";


    const loadingMessage =
        document.createElement("div");

    loadingMessage.className =
        "message ai-message";

    loadingMessage.dataset.loading =
        "true";

    loadingMessage.textContent =
        "Thinking...";


    loadingWrapper.appendChild(
        loadingMessage
    );

    chatBox.appendChild(
        loadingWrapper
    );

    loadingWrapper.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });


    try {

        const messages =
            getConversationMessages();


        // ==================================
        // CALL CLOUDFLARE WORKER
        // ==================================

        const response =
            await fetch(
                AI_WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        messages: messages
                    })

                }
            );


        let data;

        try {

            data =
                await response.json();

        } catch (error) {

            throw new Error(
                "Invalid response from AI server."
            );

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "AI request failed."
            );

        }


        const reply =
            data.answer;


        loadingWrapper.remove();


        if (
            !reply ||
            !reply.trim()
        ) {

            throw new Error(
                "AI returned an empty response."
            );

        }


        addMessage(
            reply.trim(),
            "ai"
        );


        saveChat();


    } catch (error) {

        console.error(
            "Aivora AI Error:",
            error
        );


        loadingWrapper.remove();


        let errorMessage =
            "Sorry, AI response नहीं मिल पाया। कृपया फिर से try करें।";
alert("Aivora Error: " + error.message);

        if (
            error.message &&
            error.message.includes(
                "GROQ_API_KEY"
            )
        ) {

            errorMessage =
                "AI server configuration error.";

        }


        addMessage(
            errorMessage,
            "ai"
        );


        saveChat();


    } finally {

        if (sendBtn) {

            sendBtn.disabled =
                false;

        }

        input.focus();

    }

}


// ==========================================
// SAVE CHAT
// ==========================================

function saveChat() {

    if (!chatBox) return;

    const messages = [];


    chatBox
        .querySelectorAll(".message")
        .forEach(message => {

            if (
                message.dataset.loading ===
                "true"
            ) {
                return;
            }


            messages.push({

                text:
                    message.textContent,

                type:
                    message.classList.contains(
                        "user-message"
                    )
                        ? "user"
                        : "ai"

            });

        });


    if (!messages.length) {
        return;
    }


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(messages)
    );


    let allChats = [];

    try {

        allChats =
            JSON.parse(
                localStorage.getItem(
                    CHATS_KEY
                )
            ) || [];

    } catch (error) {

        allChats = [];

    }


    const firstUser =
        messages.find(
            message =>
                message.type === "user"
        );


    const title =
        firstUser
            ? firstUser.text
                .substring(0, 35)
            : "New chat";


    const chatData = {

        id: currentChatId,

        title: title,

        messages: messages

    };


    const existingIndex =
        allChats.findIndex(
            chat =>
                chat.id === currentChatId
        );


    if (existingIndex >= 0) {

        allChats[existingIndex] =
            chatData;

    } else {

        allChats.unshift(
            chatData
        );

    }


    localStorage.setItem(
        CHATS_KEY,
        JSON.stringify(allChats)
    );


    showRecentChat();

}


// ==========================================
// LOAD CHAT
// ==========================================

function loadChat() {

    const saved =
        localStorage.getItem(
            HISTORY_KEY
        );

    if (!saved) return;


    try {

        const messages =
            JSON.parse(saved);


        if (
            messages.length > 0 &&
            welcome
        ) {

            welcome.style.display =
                "none";

        }


        messages.forEach(
            message => {

                addMessage(
                    message.text,
                    message.type
                );

            }
        );


    } catch (error) {

        console.error(
            "History error:",
            error
        );

    }

}


// ==========================================
// NEW CHAT
// ==========================================

function createNewChat() {

    saveChat();

    currentChatId =
        Date.now().toString();


    if (chatBox) {
        chatBox.innerHTML = "";
    }


    if (welcome) {
        welcome.style.display =
            "block";
    }


    if (input) {

        input.value = "";
        input.focus();

    }


    if (chatSidebar) {

        chatSidebar.classList.remove(
            "open"
        );

    }


    showRecentChat();

}


if (newChatBtn) {

    newChatBtn.addEventListener(
        "click",
        createNewChat
    );

}


if (sidebarNewChatBtn) {

    sidebarNewChatBtn.addEventListener(
        "click",
        createNewChat
    );

}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        function () {

            sendMessage();

        }
    );

}


// ==========================================
// ENTER KEY
// ==========================================

if (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// ==========================================
// SUGGESTIONS
// ==========================================

const suggestions =
    document.querySelectorAll(
        ".suggestions button"
    );


suggestions.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const text =
                    button.textContent
                        .trim();


                const prompts = {

                    "Explain something":
                        "Mujhe koi interesting topic simple Hindi mein samjhao.",

                    "Help me learn":
                        "Mujhe ek useful topic step-by-step sikhao.",

                    "Write something":
                        "Mere liye ek interesting short paragraph likho.",

                    "Help with coding":
                        "Mujhe coding ka ek useful concept simple example ke saath samjhao."

                };


                input.value =
                    prompts[text] || text;

                input.focus();

            }
        );

    }
);


// ==========================================
// VOICE INPUT
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (
    SpeechRecognition &&
    voiceBtn
) {

    recognition =
        new SpeechRecognition();

    recognition.lang =
        "hi-IN";

    recognition.continuous =
        false;

    recognition.interimResults =
        false;


    voiceBtn.addEventListener(
        "click",
        function () {

            try {

                recognition.start();

            } catch (error) {

                console.log(
                    "Voice already running"
                );

            }

        }
    );


    recognition.onresult =
        function (event) {

            const text =
                event.results[0][0]
                    .transcript;

            input.value = text;

            input.focus();

        };


    recognition.onerror =
        function (event) {

            console.log(
                "Voice error:",
                event.error
            );

        };

} else if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function () {

            alert(
                "इस browser में Voice Input supported नहीं है।"
            );

        }
    );

}


// ==========================================
// DARK MODE
// ==========================================

function applyTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    const dark =
        theme === "dark";


    document.body.classList.toggle(
        "dark-mode",
        dark
    );

}


function toggleTheme() {

    const dark =
        !document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        THEME_KEY,
        dark
            ? "dark"
            : "light"
    );


    applyTheme();

}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        toggleTheme
    );

}


if (settingsThemeBtn) {

    settingsThemeBtn.addEventListener(
        "click",
        toggleTheme
    );

}


// ==========================================
// SETTINGS
// ==========================================

if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        function () {

            if (settingsOverlay) {

                settingsOverlay.classList.add(
                    "show"
                );

            }

        }
    );

}


if (sidebarSettingsBtn) {

    sidebarSettingsBtn.addEventListener(
        "click",
        function () {

            if (chatSidebar) {

                chatSidebar.classList.remove(
                    "open"
                );

            }

            if (settingsOverlay) {

                settingsOverlay.classList.add(
                    "show"
                );

            }

        }
    );

}


if (closeSettingsBtn) {

    closeSettingsBtn.addEventListener(
        "click",
        function () {

            settingsOverlay.classList.remove(
                "show"
            );

        }
    );

}


if (settingsOverlay) {

    settingsOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                settingsOverlay
            ) {

                settingsOverlay
                    .classList
                    .remove("show");

            }

        }
    );

}


// ==========================================
// LANGUAGE
// ==========================================

if (languageSelect) {

    const savedLanguage =
        localStorage.getItem(
            LANGUAGE_KEY
        );


    if (savedLanguage) {

        languageSelect.value =
            savedLanguage;

    }


    languageSelect.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                LANGUAGE_KEY,
                languageSelect.value
            );

        }
    );

}


// ==========================================
// SEARCH
// ==========================================

if (
    searchBtn &&
    searchBox
) {

    searchBtn.addEventListener(
        "click",
        function () {

            searchBox.classList.add(
                "show"
            );

            if (searchInput) {

                searchInput.value = "";
                searchInput.focus();

            }

        }
    );

}


if (closeSearchBtn) {

    closeSearchBtn.addEventListener(
        "click",
        function () {

            searchBox.classList.remove(
                "show"
            );

            searchInput.value = "";


            chatBox
                .querySelectorAll(
                    ".message-wrapper"
                )
                .forEach(
                    wrapper => {

                        wrapper.style.display =
                            "";

                    }
                );

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            chatBox
                .querySelectorAll(
                    ".message-wrapper"
                )
                .forEach(
                    wrapper => {

                        const text =
                            wrapper.textContent
                                .toLowerCase();


                        wrapper.style.display =
                            !query ||
                            text.includes(query)
                                ? ""
                                : "none";

                    }
                );

        }
    );

}


// ==========================================
// IMAGE UPLOAD
// ==========================================

if (
    attachBtn &&
    fileInput
) {

    attachBtn.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files[0];

            if (!file) return;


            if (
                file.type.startsWith(
                    "image/"
                )
            ) {

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        const wrapper =
                            document.createElement(
                                "div"
                            );

                        wrapper.className =
                            "image-message-wrapper";


                        const image =
                            document.createElement(
                                "img"
                            );

                        image.src =
                            event.target.result;

                        image.className =
                            "chat-image";


                        wrapper.appendChild(
                            image
                        );

                        chatBox.appendChild(
                            wrapper
                        );

                        wrapper.scrollIntoView({
                            behavior: "smooth",
                            block: "end"
                        });

                    };


                reader.readAsDataURL(
                    file
                );

            } else {

                addMessage(
                    file.name,
                    "user"
                );

                saveChat();

            }


            fileInput.value = "";

        }
    );

}


// ==========================================
// CLEAR CHAT
// ==========================================

if (clearChatBtn) {

    clearChatBtn.addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "क्या आप पूरी chat history हटाना चाहते हैं?"
                );


            if (!confirmClear) {
                return;
            }


            if (chatBox) {

                chatBox.innerHTML =
                    "";

            }


            localStorage.removeItem(
                HISTORY_KEY
            );


            localStorage.removeItem(
                CHATS_KEY
            );


            if (welcome) {

                welcome.style.display =
                    "block";

            }


            showRecentChat();

        }
    );

}


// ==========================================
// PROFILE
// ==========================================

function loadProfile() {

    const savedName =
        localStorage.getItem(
            PROFILE_NAME_KEY
        );


    const savedImage =
        localStorage.getItem(
            PROFILE_IMAGE_KEY
        );


    if (
        savedName &&
        profileName
    ) {

        profileName.value =
            savedName;

    }


    if (
        savedImage &&
        profileAvatar
    ) {

        profileAvatar.style.backgroundImage =
            `url(${savedImage})`;

        profileAvatar.textContent =
            "";

    } else if (
        savedName &&
        profileAvatar
    ) {

        profileAvatar.textContent =
            savedName
                .charAt(0)
                .toUpperCase();

    }

}


function openProfile() {

    if (chatSidebar) {

        chatSidebar.classList.remove(
            "open"
        );

    }


    if (profileOverlay) {

        profileOverlay.classList.add(
            "show"
        );

    }


    loadProfile();

}


if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        openProfile
    );

}


if (sidebarProfileBtn) {

    sidebarProfileBtn.addEventListener(
        "click",
        openProfile
    );

}


if (closeProfileBtn) {

    closeProfileBtn.addEventListener(
        "click",
        function () {

            profileOverlay.classList.remove(
                "show"
            );

        }
    );

}


if (changePhotoBtn) {

    changePhotoBtn.addEventListener(
        "click",
        function () {

            profileImageInput.click();

        }
    );

}


if (profileImageInput) {

    profileImageInput.addEventListener(
        "change",
        function () {

            const file =
                profileImageInput.files[0];

            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "कृपया image चुनें।"
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        event.target.result;


                    profileAvatar
                        .style
                        .backgroundImage =
                            `url(${image})`;


                    profileAvatar.textContent =
                        "";


                    localStorage.setItem(
                        PROFILE_IMAGE_KEY,
                        image
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        function () {

            const name =
                profileName.value.trim();


            if (!name) {

                alert(
                    "कृपया अपना नाम लिखें।"
                );

                return;

            }


            localStorage.setItem(
                PROFILE_NAME_KEY,
                name
            );


            if (
                !localStorage.getItem(
                    PROFILE_IMAGE_KEY
                )
            ) {

                profileAvatar.textContent =
                    name
                        .charAt(0)
                        .toUpperCase();

            }


            profileOverlay
                .classList
                .remove("show");

        }
    );

}




// ==========================================
// SIDEBAR
// ==========================================

if (
    menuBtn &&
    chatSidebar
) {

    menuBtn.addEventListener(
        "click",
        function () {

            chatSidebar.classList.toggle(
                "open"
            );

        }
    );

}


// ==========================================
// RECENT CHATS
// ==========================================

function showRecentChat() {

    if (!chatHistory) return;


    chatHistory.innerHTML =
        "";


    let allChats = [];


    try {

        allChats =
            JSON.parse(
                localStorage.getItem(
                    CHATS_KEY
                )
            ) || [];

    } catch (error) {

        console.error(
            "Chat history error:",
            error
        );

    }


    if (
        allChats.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-history";

        empty.textContent =
            "No chats yet";

        chatHistory.appendChild(
            empty
        );

        return;

    }


    allChats.forEach(
        chat => {

            const chatItem =
                document.createElement(
                    "button"
                );


            chatItem.type =
                "button";


            chatItem.className =
                "history-item";


            chatItem.textContent =
                chat.title ||
                "New chat";


            chatItem.addEventListener(
                "click",
                function () {

                    currentChatId =
                        chat.id;


                    chatBox.innerHTML =
                        "";


                    if (welcome) {

                        welcome.style.display =
                            "none";

                    }


                    chat.messages.forEach(
                        message => {

                            addMessage(
                                message.text,
                                message.type
                            );

                        }
                    );


                    localStorage.setItem(
                        HISTORY_KEY,
                        JSON.stringify(
                            chat.messages
                        )
                    );


                    if (chatSidebar) {

                        chatSidebar
                            .classList
                            .remove("open");

                    }

                }
            );


            chatHistory.appendChild(
                chatItem
            );

        }
    );

}


// ==========================================
// START AIVORA
// ==========================================

applyTheme();

loadProfile();

loadChat();

showRecentChat();

if (input) {
    input.focus();
}



                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Invalid email or password."
                );

            }


            /*
             * Save logged-in user
             */

            currentUser = {

                id:
                    data.user?.id ||
                    data.id ||
                    null,

                name:
                    data.user?.name ||
                    data.name ||
                    email.split("@")[0],

                email:
                    data.user?.email ||
                    data.email ||
                    email

            };


            localStorage.setItem(
                "aivora_user",
                JSON.stringify(currentUser)
            );


            showAuthMessage(
                loginMessage,
                "Login successful.",
                "success"
            );


            /*
             * Close after successful login
             */

            setTimeout(
                closeAuth,
                500
            );


            updateAuthUI();


        } catch (error) {

            showAuthMessage(
                loginMessage,
                error.message ||
                "Login failed.",
                "error"
            );

        } finally {

            button.disabled = false;

            button.textContent =
                "Login";

        }

    }
);


/* ================================ */
/* MESSAGE HELPER */
/* ================================ */

function showAuthMessage(
    element,
    message,
    type
) {

    element.textContent = message;

    element.className =
        "auth-message " + type;

}


/* ================================ */
/* CHECK LOGIN BEFORE CHAT */
/* ================================ */

function requireLogin() {

    if (currentUser) {

        return true;

    }


    openAuth();

    return false;

}


/* ================================ */
/* LOGOUT */
/* ================================ */

function logoutAivora() {

    localStorage.removeItem(
        "aivora_user"
    );

    currentUser = null;

    updateAuthUI();

}


/* ================================ */
/* UPDATE PROFILE UI */
/* ================================ */

function updateAuthUI() {

    const profileName =
        document.getElementById(
            "profileName"
        );

    if (!profileName) return;


    if (currentUser) {

        profileName.textContent =
            currentUser.name;

    } else {

        profileName.textContent =
            "Login";

    }

}


/* ================================ */
/* INITIAL CHECK */
/* ================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        currentUser =
            JSON.parse(
                localStorage.getItem(
                    "aivora_user"
                )
            ) || null;

        updateAuthUI();

    }
);
