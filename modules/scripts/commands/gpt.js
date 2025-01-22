const axios = require('axios');
const url = "https://www.blackbox.ai/api/chat";
const data = {
  id: "BNAU61V",
  messages: [{ id: "BNAU61V", content: "مرحبا", role: "user" }],
  agentMode: {},
  validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
};

const headers = {
  "Content-Type": "application/json",
  Accept: "*/*",
  Origin: "https://www.blackbox.ai",
  Referer: "https://www.blackbox.ai/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
};

axios
  .post(url, data, { headers })
  .then((response) => {
    console.log("DATA :");
    console.log(response.data);
  })
  .catch((error) => {
    console.error("ERROR:");
    console.error(error.response ? error.response.data : error.message);
  });
const { gpt } = require("gpti");

module.exports.config = {
  name: "صخر",
  author: "Yan Maglinte",
  version: "1.0",
  category: "AI",
  description: "Chat with gpt",
  adminOnly: false,
  usePrefix: false,
  cooldown: 3,
};

module.exports.run = async function ({ event, args }) {
  if (event.type === "message") {
    let prompt = args.join(" ");

    let data = await gpt.v1({
        messages: [],
        prompt: prompt,
        model: "GPT-4",
        markdown: false
    });

    api.sendMessage(data.gpt, event.sender.id).catch(err => {
        console.log(err);
    });
  } else if (event.type === "message_reply") {
    let prompt = `Message: "${args.join(" ")}\n\nReplying to: ${event.message.reply_to.text}`;

    let data = await gpt.v1({
        messages: [],
        prompt: prompt,
        model: "GPT-4",
        markdown: false
    });

    api.sendMessage(data.gpt, event.sender.id).catch(err => {
        console.log(err);
    });
  }
};
