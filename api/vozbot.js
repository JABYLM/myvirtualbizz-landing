export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensaje no recibido" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres VozBot, el asistente de atención telefónica automática de MyVirtualBizz. Tu función es explicar cómo funciona la atención por voz usando inteligencia artificial. Informa a los clientes de que la voz es natural, que responde a preguntas por teléfono y que puede integrarse con centralitas. Sé profesional, breve, y responde siempre en español.",
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
    console.log("🔍 Respuesta completa de OpenAI:", data);

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      const errorMessage = data.error?.message || "Respuesta no válida de OpenAI";
      return res.status(500).json({ error: errorMessage });
    }

    // ✅ RESPUESTA CORREGIDA
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Error GPT:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
