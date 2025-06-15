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
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Respuesta no válida de OpenAI");
    }

    res.status(200).json(reply);
  } catch (error) {
    console.error("Error GPT:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
