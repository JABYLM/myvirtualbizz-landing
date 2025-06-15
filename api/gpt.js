export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensaje no recibido" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "❌ OPENAI_API_KEY no está definida en el entorno" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres el InfoBot de MyVirtualBizz. Responde como un asistente profesional, breve y amigable. No des respuestas largas ni genéricas.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🧨 OpenAI Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Error al procesar la respuesta de OpenAI",
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "Respuesta no válida de OpenAI" });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error interno:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
}
