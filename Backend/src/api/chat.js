import { isEcommerceIntent } from "../lib/intentFilter";
import { buildContext } from "../lib/contextBuilder";
import { SYSTEM_PROMPT } from "../lib/systemPrompt";

export default async function handler(req, res) {
    try {
        const { message, user, lastOrder } = req.body;

        // Intent filter
        if (!isEcommerceIntent(message)) {
            return res.json({
                reply:
                    "I can only help with questions related to our store, orders, and products."
            });
        }

        // Build safe context
        const context = buildContext({ user, lastOrder });

        // Call Gemini
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `
                                        ${SYSTEM_PROMPT}
                                        ${context}
                                        USER QUESTION:
                                        ${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I can only help with store-related questions.";

        res.json({ reply });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.json({
            reply: "Sorry, something went wrong. Please try again later."
        });
    }
}
