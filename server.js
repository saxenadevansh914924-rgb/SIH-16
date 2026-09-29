import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import express from "express";
import OpenAI from "openai";
import { research } from "./src/data/research.js";
import { datasets } from "./src/data/datasets.js";

const app = express();
app.use(express.json({ limit: "32kb" }));
const port = Number(process.env.API_PORT || 3001);

app.post("/api/chat", async (req, res) => {
  const incoming = Array.isArray(req.body?.messages)
    ? req.body.messages.slice(-8)
    : [];
  const messages = incoming
    .filter(
      (message) =>
        ["user", "assistant"].includes(message?.role) &&
        typeof message?.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 2000),
    }));

  if (!messages.length || messages.at(-1).role !== "user") {
    return res
      .status(400)
      .json({ error: "Send a message to start the conversation." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(503)
      .json({
        error:
          "OpenAI is not configured. Add OPENAI_API_KEY to frontend/.env.local and restart the app.",
      });
  }

  const researchContext = research
    .map(
      (item) =>
        `Research: ${item.title} (${item.year}), ${item.org}, ${item.state}. ${item.abstract} Keywords: ${item.keywords.join(", ")}.`,
    )
    .join("\n");
  const datasetContext = datasets
    .map(
      (item) =>
        `Dataset: ${item.name}; theme ${item.category}; state ${item.state}; format ${item.format}.`,
    )
    .join("\n");

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: `You are Bhoomi Assistant, a research aide for land governance in India. Answer clearly and concisely. Ground claims in the provided prototype research and dataset catalogue. Cite sources by their exact titles when relevant. Never present fictional prototype records or metrics as official government evidence. If the catalogue does not support a claim, say so. Explain that this is a prototype evidence collection when appropriate.\n\nRESEARCH CATALOGUE:\n${researchContext}\n\nDATASET CATALOGUE:\n${datasetContext}`,
      input: messages,
      max_output_tokens: 700,
    });
    return res.json({
      answer:
        response.output_text ||
        "I could not generate a response. Please try again.",
    });
  } catch (error) {
    console.error(
      "OpenAI request failed:",
      error?.status || error?.name || "Unknown error",
    );
    return res
      .status(502)
      .json({
        error:
          "The AI service could not complete this request. Check the API key, model access, and billing, then try again.",
      });
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Bhoomi AI API listening on http://127.0.0.1:${port}`);
});
