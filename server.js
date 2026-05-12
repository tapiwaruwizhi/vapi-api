require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

/**
 * Homepage
 */
app.get("/", (req, res) => {
  res.send(`
    <body style="
      background:black;
      color:white;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      margin:0;
      font-family:Arial;
    ">
      <div style="text-align:center;">
        <h1>Vapi Server Running</h1>
        <p>Dynamic AI Calling API</p>
      </div>
    </body>
  `);
});

/**
 * Dynamic Vapi Call
 */
app.post("/call", async (req, res) => {
  try {

    const {
      number,
      firstMessage,
      systemMessage
    } = req.body;

    /**
     * Validation
     */
    if (!number) {
      return res.status(400).json({
        error: "Phone number is required"
      });
    }

    const response = await axios.post(
      "https://api.vapi.ai/call",
      {
        assistantId: process.env.ASSISTANT_ID,
        phoneNumberId: process.env.PHONE_NUMBER_ID,

        customer: {
          number
        },

assistantOverrides: {
  firstMessage: firstMessage || "Hello.",

  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          systemMessage ||
          "You are a helpful AI assistant."
      }
    ]
  }
}
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data || error.message
    });
  }
});

/**
 * Start server
 */
app.listen(3000, "0.0.0.0", () => {
  console.log(
    "Server running on http://localhost:3000"
  );
});