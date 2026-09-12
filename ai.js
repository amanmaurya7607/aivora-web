// ==========================================
// Aivora AI Connector
// Cloudflare Worker + Groq
// ==========================================

const AIConnector = {

    endpoint:
        "https://aivora-ai.amanmaurya5172.workers.dev",

    async ask(message) {

        const response = await fetch(
            this.endpoint,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        if (!response.ok) {

            let details = "";

            try {
                details = await response.text();
            } catch (e) {}

            console.error(
                "Aivora Worker Error:",
                response.status,
                details
            );

            throw new Error(
                "AI service unavailable"
            );
        }

        const data =
            await response.json();

        const reply =
            data.choices?.[0]?.message?.content;

        if (!reply) {

            console.error(
                "Invalid AI response:",
                data
            );

            throw new Error(
                "Empty AI response"
            );
        }

        return reply.trim();
    }
};