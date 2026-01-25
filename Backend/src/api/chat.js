import { isEcommerceIntent } from "../lib/intentFilter";
import { buildContext } from "../lib/contextBuilder";
import { SYSTEM_PROMPT } from "../lib/systemPrompt";

export default async function handler(req, res) {
    try {
        const { message, user, lastOrder } = req.body;

        if (!isEcommerceIntent(message)) {
            return res.json({
                reply: "I can only help with questions related to our store, orders, and products."
            });
        }

        const context = buildContext({ user, lastOrder });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `${SYSTEM_PROMPT}\n\n${context}\n\nUSER QUESTION:\n${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error("Gemini API Error:", err);
            throw new Error("Gemini API failed");
        }

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
