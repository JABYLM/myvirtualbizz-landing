
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
        Authorization: `Bearer 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`,

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

    // 🧠 MOSTRAR TODO EL OBJETO devuelto por OpenAI en consola
    console.log("🔍 Respuesta completa de OpenAI:", data);

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      // Si no hay respuesta válida, mostrar el mensaje de error de OpenAI si existe
      const errorMessage = data.error?.message || "Respuesta no válida de OpenAI";
      return res.status(500).json({ error: errorMessage });
    }

    // Todo OK
    res.status(200).json(reply);
  } catch (error) {
    // Error interno (problemas con fetch, red, etc.)
    console.error("❌ Error GPT:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
