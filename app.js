// ==========================================
// AIVORA AI - MAIN APP.JS
// ==========================================

// ==========================================
// CONFIG
// ==========================================

const AI_WORKER_URL =
    "https://chataivora-ai.amanmaurya5172.workers.dev/api/chat";

const AUTH_API =
    "https://chataivora-ai.amanmaurya5172.workers.dev/api/auth";

const HISTORY_KEY = "aivora_chat_history";
const CHATS_KEY = "aivora_all_chats";
const THEME_KEY = "aivora_theme";
const LANGUAGE_KEY = "aivora_language";

const PROFILE_NAME_KEY = "aivora_profile_name";
const PROFILE_IMAGE_KEY = "aivora_profile_image";

const AUTH_USER_KEY = "aivora_user";

let currentChatId = Date.now().toString();


// ==========================================
// DOM HELPER
// ==========================================

function $(id) {
    return document.getElementById(id);
}

function on(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}


// ==========================================
// DOM ELEMENTS
// ==========================================

const chatSidebar = $("chatSidebar");
const sidebarNewChatBtn = $("sidebarNewChatBtn");
const chatHistory = $("chatHistory");
const sidebarProfileBtn = $("sidebarProfileBtn");
const sidebarSettingsBtn = $("sidebarSettingsBtn");

const menuBtn = $("menuBtn");

const welcome = $("welcome");
const chatBox = $("chatBox");

const voiceBtn = $("voiceBtn");
const attachBtn = $("attachBtn");
const fileInput = $("fileInput");
const messageInput = $("messageInput");
const sendBtn = $("sendBtn");

const settingsOverlay = $("settingsOverlay");
const closeSettingsBtn = $("closeSettingsBtn");
const settingsThemeBtn = $("settingsThemeBtn");
const languageSelect = $("languageSelect");
const clearChatBtn = $("clearChatBtn");

const authOverlay = $("authOverlay");
const closeAuthBtn = $("closeAuthBtn");

const loginSection = $("loginSection");
const loginForm = $("loginForm");
const loginEmail = $("loginEmail");
const loginPassword = $("loginPassword");
const loginMessage = $("loginMessage");
const showSignupBtn = $("showSignupBtn");

const signupSection = $("signupSection");
const signupForm = $("signupForm");
const signupName = $("signupName");
const signupEmail = $("signupEmail");
const signupPassword = $("signupPassword");
const signupMessage = $("signupMessage");
const showLoginBtn = $("showLoginBtn");


// ==========================================
// AUTH
// ==========================================

function getLoggedInUser() {
    try {
        const user = localStorage.getItem(AUTH_USER_KEY);

        if (!user) {
            return null;
        }

        return JSON.parse(user);
    } catch (error) {
        console.error("Auth data error:", error);
        return null;
    }
}


function isLoggedIn() {
    return !!getLoggedInUser();
}


function saveLoggedInUser(user) {
    localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(user)
    );
}


function logoutUser() {
    localStorage.removeItem(AUTH_USER_KEY);

    alert("You have been logged out.");

    closeAuth();
}


// ==========================================
// AUTH OVERLAY
// ==========================================

function openAuth() {
    if (!authOverlay) return;

    authOverlay.classList.add("show");

    showLogin();

    if (loginEmail) {
        loginEmail.focus();
    }
}


function closeAuth() {
    if (!authOverlay) return;

    authOverlay.classList.remove("show");
}


function showLogin() {
    if (loginSection) {
        loginSection.classList.remove("hidden");
    }

    if (signupSection) {
        signupSection.classList.add("hidden");
    }

    if (loginMessage) {
        loginMessage.textContent = "";
    }

    if (signupMessage) {
        signupMessage.textContent = "";
    }
}


function showSignup() {
    if (loginSection) {
        loginSection.classList.add("hidden");
    }

    if (signupSection) {
        signupSection.classList.remove("hidden");
    }

    if (loginMessage) {
        loginMessage.textContent = "";
    }

    if (signupMessage) {
        signupMessage.textContent = "";
    }

    if (signupName) {
        signupName.focus();
    }
}


// ==========================================
// LOGIN
// ==========================================

on(loginForm, "submit", async function (event) {

    event.preventDefault();

    const email = loginEmail?.value.trim().toLowerCase();
    const password = loginPassword?.value || "";

    if (!email || !password) {

        if (loginMessage) {
            loginMessage.textContent =
                "Email aur password dono enter karo.";
        }

        return;
    }

    const submitButton =
        loginForm.querySelector('button[type="submit"]');

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";
    }

    if (loginMessage) {
        loginMessage.textContent = "Please wait...";
    }

    try {

        const response = await fetch(
            AUTH_API + "/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json()
            .catch(() => ({}));

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Login failed."
            );
        }

        const user =
            data.user ||
            {
                name: data.name || "",
                email: email
            };

        saveLoggedInUser(user);

        if (loginMessage) {
            loginMessage.textContent =
                "Login successful.";
        }

        setTimeout(() => {
            closeAuth();
        }, 500);

    } catch (error) {

        console.error("Login error:", error);

        if (loginMessage) {
            loginMessage.textContent =
                error.message || "Login failed.";
        }

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    }
});


// ==========================================
// SIGNUP
// ==========================================

on(signupForm, "submit", async function (event) {

    event.preventDefault();

    const name = signupName?.value.trim();
    const email = signupEmail?.value.trim().toLowerCase();
    const password = signupPassword?.value || "";

    if (!name || !email || !password) {

        if (signupMessage) {
            signupMessage.textContent =
                "Sabhi fields fill karo.";
        }

        return;
    }

    if (password.length < 6) {

        if (signupMessage) {
            signupMessage.textContent =
                "Password kam se kam 6 characters ka hona chahiye.";
        }

        return;
    }

    const submitButton =
        signupForm.querySelector('button[type="submit"]');

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating...";
    }

    if (signupMessage) {
        signupMessage.textContent =
            "Account create ho raha hai...";
    }

    try {

        const response = await fetch(
            AUTH_API + "/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json()
            .catch(() => ({}));

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Signup failed."
            );
        }

        if (signupMessage) {
            signupMessage.textContent =
                "Account created successfully.";
        }

        if (loginEmail) {
            loginEmail.value = email;
        }

        if (loginPassword) {
            loginPassword.value = "";
        }

        setTimeout(() => {
            showLogin();

            if (loginMessage) {
                loginMessage.textContent =
                    "Account created. Ab login karo.";
            }

            if (loginEmail) {
                loginEmail.value = email;
                loginEmail.focus();
            }
        }, 700);

    } catch (error) {

        console.error("Signup error:", error);

        if (signupMessage) {
            signupMessage.textContent =
                error.message || "Signup failed.";
        }

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Create account";
        }
    }
});


// ==========================================
// AUTH BUTTONS
// ==========================================

on(closeAuthBtn, "click", closeAuth);

on(showSignupBtn, "click", function () {
    showSignup();
});

on(showLoginBtn, "click", function () {
    showLogin();
});


// ==========================================
// CLOSE AUTH WHEN CLICKING OUTSIDE
// ==========================================

on(authOverlay, "click", function (event) {

    if (event.target === authOverlay) {
        closeAuth();
    }
});


// ==========================================
// AI CONNECTOR
// ==========================================

const AIConnector = {

    async ask(text) {

        const user = getLoggedInUser();

        if (!user) {
            throw new Error("LOGIN_REQUIRED");
        }

        const messages = [];

        if (chatBox) {

            const messageElements =
                chatBox.querySelectorAll(".message");

            messageElements.forEach((message) => {

                const isUser =
                    message.classList.contains("user-message");

                const content =
                    message.querySelector(".message-content");

                if (!content) return;

                const value =
                    content.textContent.trim();

                if (!value) return;

                messages.push({
                    role: isUser
                        ? "user"
                        : "assistant",

                    content: value
                });
            });
        }

        const response = await fetch(
            AI_WORKER_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: text,

                    messages:
                        messages.slice(-20),

                    user: user
                })
            }
        );

        const data = await response.json()
            .catch(() => ({}));

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "AI request failed."
            );
        }

        if (!data.answer) {
            throw new Error(
                "AI ne koi answer nahi diya."
            );
        }

        return data.answer;
    }
};


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    if (!messageInput) return;

    const text =
        messageInput.value.trim();

    if (!text) return;


    // LOGIN REQUIRED
    if (!isLoggedIn()) {

        openAuth();

        if (loginMessage) {
            loginMessage.textContent =
                "Aivora use karne ke liye pehle login karo.";
        }

        return;
    }


    // HIDE WELCOME
    if (welcome) {
        welcome.classList.add("hidden");
    }


    // ADD USER MESSAGE
    addMessage(
        text,
        true
    );


    // SAVE
    saveChat();


    // CLEAR INPUT
    messageInput.value = "";

    autoResizeTextarea();


    // DISABLE SEND
    if (sendBtn) {
        sendBtn.disabled = true;
    }


    // LOADING MESSAGE
    const loading =
        createLoadingMessage();


    try {

        const answer =
            await AIConnector.ask(text);


        // REMOVE LOADING
        if (loading) {
            loading.remove();
        }


        // ADD AI RESPONSE
        addMessage(
            answer,
            false
        );


        // SAVE
        saveChat();

    } catch (error) {

        console.error("AI Error:", error);


        if (loading) {
            loading.remove();
        }


        if (error.message === "LOGIN_REQUIRED") {

            openAuth();

            if (loginMessage) {
                loginMessage.textContent =
                    "Login karke Aivora use karo.";
            }

            return;
        }


        addMessage(
            "AI Error: " +
            (error.message || "Something went wrong."),
            false
        );

    } finally {

        if (sendBtn) {
            sendBtn.disabled = false;
        }

        messageInput.focus();
    }
}


// ==========================================
// SEND BUTTON
// ==========================================

on(sendBtn, "click", sendMessage);


// ==========================================
// ENTER TO SEND
// ==========================================

on(messageInput, "keydown", function (event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }
});


// ==========================================
// AUTO RESIZE TEXTAREA
// ==========================================

function autoResizeTextarea() {

    if (!messageInput) return;

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            180
        ) + "px";
}

on(
    messageInput,
    "input",
    autoResizeTextarea
);


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(text, isUser = false) {

    if (!chatBox) return null;

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message-wrapper " +
        (isUser
            ? "user-wrapper"
            : "assistant-wrapper");


    const message =
        document.createElement("div");

    message.className =
        "message " +
        (isUser
            ? "user-message"
            : "assistant-message");


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    // SECURITY:
    // User/AI text ko directly HTML nahi banate.
    content.textContent = text;


    message.appendChild(content);


    // ======================================
    // AI ACTION BUTTONS
    // ======================================

    if (!isUser) {

        const actions =
            document.createElement("div");

        actions.className =
            "message-actions";


        // COPY
        const copyBtn =
            createIconButton(
                "Copy",
                getCopyIcon()
            );


        // LIKE
        const likeBtn =
            createIconButton(
                "Good response",
                getLikeIcon()
            );


        // DISLIKE
        const dislikeBtn =
            createIconButton(
                "Bad response",
                getDislikeIcon()
            );


        // READ ALOUD
        const readBtn =
            createIconButton(
                "Read aloud",
                getVolumeIcon()
            );


        // REGENERATE
        const regenerateBtn =
            createIconButton(
                "Regenerate",
                getRefreshIcon()
            );


        // COPY EVENT
        on(copyBtn, "click", async function () {

            try {

                await navigator.clipboard.writeText(
                    text
                );

                copyBtn.title =
                    "Copied";

                setTimeout(() => {
                    copyBtn.title = "Copy";
                }, 1500);

            } catch (error) {

                fallbackCopy(text);

            }
        });


        // LIKE
        on(likeBtn, "click", function () {

            likeBtn.classList.add("active");

            dislikeBtn.classList.remove("active");
        });


        // DISLIKE
        on(dislikeBtn, "click", function () {

            dislikeBtn.classList.add("active");

            likeBtn.classList.remove("active");
        });


        // READ ALOUD
        on(readBtn, "click", function () {

            speakText(text);
        });


        // REGENERATE
        on(
            regenerateBtn,
            "click",
            function () {

                regenerateLastResponse();
            }
        );


        actions.appendChild(copyBtn);
        actions.appendChild(likeBtn);
        actions.appendChild(dislikeBtn);
        actions.appendChild(readBtn);
        actions.appendChild(regenerateBtn);

        message.appendChild(actions);
    }


    wrapper.appendChild(message);

    chatBox.appendChild(wrapper);


    // SCROLL
    chatBox.scrollTop =
        chatBox.scrollHeight;


    return wrapper;
}


// ==========================================
// LOADING MESSAGE
// ==========================================

function createLoadingMessage() {

    if (!chatBox) return null;

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message-wrapper assistant-wrapper";


    const message =
        document.createElement("div");

    message.className =
        "message assistant-message loading-message";


    const content =
        document.createElement("div");

    content.className =
        "message-content";

    content.textContent =
        "Aivora is thinking...";


    message.appendChild(content);

    wrapper.appendChild(message);

    chatBox.appendChild(wrapper);

    chatBox.scrollTop =
        chatBox.scrollHeight;


    return wrapper;
}


// ==========================================
// CREATE ICON BUTTON
// ==========================================

function createIconButton(
    title,
    icon
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "message-action";

    button.title = title;

    button.setAttribute(
        "aria-label",
        title
    );

    button.innerHTML = icon;

    return button;
}


// ==========================================
// COPY FALLBACK
// ==========================================

function fallbackCopy(text) {

    const textarea =
        document.createElement("textarea");

    textarea.value = text;

    textarea.style.position =
        "fixed";

    textarea.style.opacity = "0";

    document.body.appendChild(
        textarea
    );

    textarea.select();

    try {
        document.execCommand("copy");
    } catch (error) {
        console.error(
            "Copy failed:",
            error
        );
    }

    textarea.remove();
}


// ==========================================
// READ ALOUD
// ==========================================

function speakText(text) {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Read aloud browser mein supported nahi hai."
        );

        return;
    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    const language =
        localStorage.getItem(
            LANGUAGE_KEY
        ) || "en";


    speech.lang =
        language === "hi"
            ? "hi-IN"
            : "en-US";


    speech.rate = 1;

    speech.pitch = 1;


    window.speechSynthesis.speak(
        speech
    );
}


// ==========================================
// REGENERATE
// ==========================================

async function regenerateLastResponse() {

    if (!isLoggedIn()) {
        openAuth();
        return;
    }

    if (!chatBox) return;


    const messages =
        Array.from(
            chatBox.querySelectorAll(
                ".message"
            )
        );


    let lastUserMessage = null;

    for (
        let i = messages.length - 1;
        i >= 0;
        i--
    ) {

        if (
            messages[i].classList.contains(
                "user-message"
            )
        ) {

            lastUserMessage =
                messages[i];

            break;
        }
    }


    if (!lastUserMessage) {
        return;
    }


    const content =
        lastUserMessage.querySelector(
            ".message-content"
        );


    if (!content) return;


    const text =
        content.textContent.trim();


    // Remove all assistant messages after
    // last user message
    let current =
        lastUserMessage.parentElement?.nextElementSibling;


    while (current) {

        const next =
            current.nextElementSibling;

        const isAssistant =
            current.querySelector(
                ".assistant-message"
            );

        if (isAssistant) {
            current.remove();
        }

        current = next;
    }


    // Temporarily put text into input
    if (messageInput) {
        messageInput.value = text;
    }


    // Remove last user message
    // so duplicate user message is not created
    if (
        lastUserMessage.parentElement
    ) {
        lastUserMessage.parentElement.remove();
    }


    saveChat();

    await sendMessage();
}


// ==========================================
// NEW CHAT
// ==========================================

function newChat() {

    saveChat();


    currentChatId =
        Date.now().toString();


    if (chatBox) {
        chatBox.innerHTML = "";
    }


    if (welcome) {
        welcome.classList.remove(
            "hidden"
        );
    }


    if (messageInput) {
        messageInput.value = "";
        autoResizeTextarea();
        messageInput.focus();
    }


    if (chatSidebar) {
        chatSidebar.classList.remove(
            "open"
        );
    }
}


// ==========================================
// NEW CHAT BUTTON
// ==========================================

on(
    sidebarNewChatBtn,
    "click",
    newChat
);


// ==========================================
// SIDEBAR
// ==========================================

on(
    menuBtn,
    "click",
    function () {

        if (!chatSidebar) return;

        chatSidebar.classList.toggle(
            "open"
        );
    }
);


// ==========================================
// SIDEBAR PROFILE
// ==========================================

on(
    sidebarProfileBtn,
    "click",
    function () {

        const user =
            getLoggedInUser();

        if (!user) {

            openAuth();

            return;
        }

        const name =
            user.name ||
            "User";

        alert(
            "Logged in as:\n" +
            name +
            "\n" +
            (user.email || "")
        );
    }
);


// ==========================================
// SETTINGS
// ==========================================

function openSettings() {

    if (!settingsOverlay) return;

    settingsOverlay.classList.add(
        "show"
    );
}


function closeSettings() {

    if (!settingsOverlay) return;

    settingsOverlay.classList.remove(
        "show"
    );
}


on(
    sidebarSettingsBtn,
    "click",
    function () {

        if (chatSidebar) {
            chatSidebar.classList.remove(
                "open"
            );
        }

        openSettings();
    }
);


on(
    closeSettingsBtn,
    "click",
    closeSettings
);


on(
    settingsOverlay,
    "click",
    function (event) {

        if (
            event.target === settingsOverlay
        ) {
            closeSettings();
        }
    }
);


// ==========================================
// THEME
// ==========================================

function applyTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        ) || "light";


    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );


    if (settingsThemeBtn) {

        settingsThemeBtn.setAttribute(
            "aria-pressed",
            theme === "dark"
                ? "true"
                : "false"
        );
    }
}


function toggleTheme() {

    const current =
        localStorage.getItem(
            THEME_KEY
        ) || "light";


    const next =
        current === "dark"
            ? "light"
            : "dark";


    localStorage.setItem(
        THEME_KEY,
        next
    );


    applyTheme();
}


on(
    settingsThemeBtn,
    "click",
    toggleTheme
);


// ==========================================
// LANGUAGE
// ==========================================

function loadLanguage() {

    const language =
        localStorage.getItem(
            LANGUAGE_KEY
        ) || "en";


    if (languageSelect) {
        languageSelect.value =
            language;
    }
}


on(
    languageSelect,
    "change",
    function () {

        localStorage.setItem(
            LANGUAGE_KEY,
            languageSelect.value
        );
    }
);


// ==========================================
// CLEAR ALL CHATS
// ==========================================

on(
    clearChatBtn,
    "click",
    function () {

        const confirmed =
            confirm(
                "Kya aap sabhi saved chats delete karna chahte hain?"
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem(
            HISTORY_KEY
        );

        localStorage.removeItem(
            CHATS_KEY
        );


        currentChatId =
            Date.now().toString();


        if (chatBox) {
            chatBox.innerHTML = "";
        }


        if (welcome) {
            welcome.classList.remove(
                "hidden"
            );
        }


        showRecentChats();

        closeSettings();
    }
);


// ==========================================
// SAVE CHAT
// ==========================================

function saveChat() {

    if (!chatBox) return;


    const messages = [];


    chatBox
        .querySelectorAll(".message")
        .forEach((message) => {

            const content =
                message.querySelector(
                    ".message-content"
                );

            if (!content) return;


            const text =
                content.textContent.trim();


            if (!text) return;


            messages.push({

                role:
                    message.classList.contains(
                        "user-message"
                    )
                        ? "user"
                        : "assistant",

                content: text
            });
        });


    if (!messages.length) {
        return;
    }


    // Current chat
    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(messages)
    );


    // All chats
    let chats = [];


    try {

        chats =
            JSON.parse(
                localStorage.getItem(
                    CHATS_KEY
                )
            ) || [];

    } catch (error) {

        chats = [];
    }


    const existingIndex =
        chats.findIndex(
            chat =>
                chat.id === currentChatId
        );


    const firstUserMessage =
        messages.find(
            message =>
                message.role === "user"
        );


    const title =
        firstUserMessage
            ? firstUserMessage.content
                .slice(0, 40)
            : "New chat";


    const chatData = {

        id: currentChatId,

        title: title,

        messages: messages,

        updatedAt:
            Date.now()
    };


    if (existingIndex >= 0) {

        chats[existingIndex] =
            chatData;

    } else {

        chats.unshift(
            chatData
        );
    }


    // Latest first
    chats.sort(
        (a, b) =>
            b.updatedAt -
            a.updatedAt
    );


    // Keep last 50 chats
    chats =
        chats.slice(0, 50);


    localStorage.setItem(
        CHATS_KEY,
        JSON.stringify(chats)
    );


    showRecentChats();
}


// ==========================================
// SHOW RECENT CHATS
// ==========================================

function showRecentChats() {

    if (!chatHistory) return;


    chatHistory.innerHTML = "";


    let chats = [];


    try {

        chats =
            JSON.parse(
                localStorage.getItem(
                    CHATS_KEY
                )
            ) || [];

    } catch (error) {

        chats = [];
    }


    if (!chats.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-history";

        empty.textContent =
            "No recent chats";

        chatHistory.appendChild(
            empty
        );

        return;
    }


    chats.forEach(
        (chat) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "chat-history-item";


            button.textContent =
                chat.title ||
                "New chat";


            on(
                button,
                "click",
                function () {

                    loadChat(
                        chat.id
                    );

                    if (chatSidebar) {
                        chatSidebar.classList.remove(
                            "open"
                        );
                    }
                }
            );


            chatHistory.appendChild(
                button
            );
        }
    );
}


// ==========================================
// LOAD CHAT
// ==========================================

function loadChat(chatId) {

    let chats = [];


    try {

        chats =
            JSON.parse(
                localStorage.getItem(
                    CHATS_KEY
                )
            ) || [];

    } catch (error) {

        chats = [];
    }


    const chat =
        chats.find(
            item =>
                item.id === chatId
        );


    if (!chat) return;


    currentChatId =
        chat.id;


    if (chatBox) {
        chatBox.innerHTML = "";
    }


    if (welcome) {
        welcome.classList.add(
            "hidden"
        );
    }


    if (
        Array.isArray(
            chat.messages
        )
    ) {

        chat.messages.forEach(
            message => {

                addMessage(
                    message.content,
                    message.role === "user"
                );
            }
        );
    }


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(
            chat.messages || []
        )
    );
}


// ==========================================
// LOAD CURRENT HISTORY
// ==========================================

function loadCurrentHistory() {

    if (!chatBox) return;


    let messages = [];


    try {

        messages =
            JSON.parse(
                localStorage.getItem(
                    HISTORY_KEY
                )
            ) || [];

    } catch (error) {

        messages = [];
    }


    if (!messages.length) {
        return;
    }


    if (welcome) {
        welcome.classList.add(
            "hidden"
        );
    }


    messages.forEach(
        message => {

            addMessage(
                message.content,
                message.role === "user"
            );
        }
    );
}


// ==========================================
// ATTACH FILE
// ==========================================

on(
    attachBtn,
    "click",
    function () {

        if (fileInput) {
            fileInput.click();
        }
    }
);


on(
    fileInput,
    "change",
    function () {

        const file =
            fileInput.files?.[0];


        if (!file) {
            return;
        }


        // Image
        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            showAttachedImage(
                file
            );

        } else {

            addMessage(
                "Attached file: " +
                file.name,
                true
            );

            saveChat();
        }


        fileInput.value = "";
    }
);


// ==========================================
// SHOW ATTACHED IMAGE
// ==========================================

function showAttachedImage(file) {

    if (!chatBox) return;


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "message-wrapper user-wrapper";


    const message =
        document.createElement(
            "div"
        );

    message.className =
        "message user-message";


    const image =
        document.createElement(
            "img"
        );


    image.style.maxWidth =
        "280px";

    image.style.maxHeight =
        "280px";

    image.style.borderRadius =
        "12px";

    image.style.display =
        "block";


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            image.src =
                event.target.result;
        };


    reader.readAsDataURL(
        file
    );


    message.appendChild(
        image
    );

    wrapper.appendChild(
        message
    );

    chatBox.appendChild(
        wrapper
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// ==========================================
// VOICE INPUT
// ==========================================

let recognition = null;

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.continuous =
        false;

    recognition.interimResults =
        false;


    recognition.onstart =
        function () {

            if (voiceBtn) {
                voiceBtn.classList.add(
                    "active"
                );
            }
        };


    recognition.onend =
        function () {

            if (voiceBtn) {
                voiceBtn.classList.remove(
                    "active"
                );
            }
        };


    recognition.onerror =
        function (event) {

            console.error(
                "Voice error:",
                event.error
            );
        };


    recognition.onresult =
        function (event) {

            const transcript =
                event.results[0][0]
                    .transcript;


            if (messageInput) {

                messageInput.value +=
                    (
                        messageInput.value
                            ? " "
                            : ""
                    ) +
                    transcript;


                autoResizeTextarea();
            }
        };
}


on(
    voiceBtn,
    "click",
    function () {

        if (!recognition) {

            alert(
                "Voice input is not supported in this browser."
            );

            return;
        }


        const language =
            localStorage.getItem(
                LANGUAGE_KEY
            ) || "en";


        recognition.lang =
            language === "hi"
                ? "hi-IN"
                : "en-IN";


        try {

            recognition.start();

        } catch (error) {

            console.log(
                "Voice already running."
            );
        }
    }
);


// ==========================================
// SVG ICONS
// ==========================================

function getCopyIcon() {

    return `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
            ></rect>

            <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            ></path>
        </svg>
    `;
}


function getLikeIcon() {

    return `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path
                d="M7 10v12"
            ></path>

            <path
                d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"
            ></path>
        </svg>
    `;
}


function getDislikeIcon() {

    return `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path
                d="M17 14V2"
            ></path>

            <path
                d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"
            ></path>
        </svg>
    `;
}


function getVolumeIcon() {

    return `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polygon
                points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
            ></polygon>

            <path
                d="M19.07 4.93a10 10 0 0 1 0 14.14"
            ></path>

            <path
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
            ></path>
        </svg>
    `;
}


function getRefreshIcon() {

    return `
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polyline
                points="23 4 23 10 17 10"
            ></polyline>

            <polyline
                points="1 20 1 14 7 14"
            ></polyline>

            <path
                d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"
            ></path>

            <path
                d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"
            ></path>
        </svg>
    `;
}


// ==========================================
// INITIALIZE APP
// ==========================================

function initializeApp() {

    applyTheme();

    loadLanguage();

    loadCurrentHistory();

    showRecentChats();

    autoResizeTextarea();


    // If user is already logged in,
    // no login popup is opened.
    const user =
        getLoggedInUser();

    if (user) {

        console.log(
            "Aivora user:",
            user.email || user.name
        );
    }


    console.log(
        "Aivora AI initialized successfully."
    );
}


// ==========================================
// START
// ==========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
}