export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Google API key is missing. Check GOOGLE_API_KEY in Vercel."
      });
    }

    const { prompt, websiteType } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Please describe the website you want to create." });
    }

    const instructions = [
      "You are KAIROS WEB AI, an expert frontend website developer.",
      "Create a complete, polished, responsive, functional website using HTML, CSS and vanilla JavaScript.",
      "Return only valid JSON with exactly three string properties: html, css and js.",
      "Do not use Markdown fences. Put body content only in html, styles only in css, and scripts only in js.",
      "Use semantic accessible HTML, responsive layouts, thoughtful spacing, and professional visual design.",
      "Do not include external dependencies unless the user specifically requests them.",
      "Make buttons and navigation work where practical. Do not invent real business contact details or claim real payments are integrated."
    ].join(" ");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: instructions }]
          },
          contents: [{
            role: "user",
            parts: [{
              text: `Website type: ${websiteType || "Professional website"}\n\nWebsite brief:\n${prompt}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                html: { type: "STRING" },
                css: { type: "STRING" },
                js: { type: "STRING" }
              },
              required: ["html", "css", "js"]
            },
            temperature: 0.7,
            maxOutputTokens: 16384
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini request failed."
      });
    }

    const generatedText = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    if (!generatedText) {
      return res.status(502).json({ error: "Gemini returned an empty response. Please try again." });
    }

    const result = JSON.parse(generatedText);

    if (
      typeof result.html !== "string" ||
      typeof result.css !== "string" ||
      typeof result.js !== "string"
    ) {
      return res.status(502).json({ error: "Gemini returned an invalid website format. Please try again." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("KAIROS WEB AI generation error:", error);
    return res.status(500).json({
      error: "Something went wrong while generating your website. Please try again."
    });
  }
}
