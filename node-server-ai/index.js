const express = require('express');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/get-summary', async (req, res) => {
  const { message } = req.body;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": message }
        ],
        model: "gpt-4o-mini",
    });
    res.json(completion.choices[0]);
  } catch (error) {
    res.status(500).send(`Error communicating with OpenAI API: ${error}`);
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});