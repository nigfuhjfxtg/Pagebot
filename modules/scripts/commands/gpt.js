const axios = require('axios');

module.exports.config = {
  name: "صخر",
  author: "Yan Maglinte",
  version: "1.0",
  category: "AI",
  description: "Chat with Blackbox AI",
  adminOnly: false,
  usePrefix: false,
  cooldown: 3,
};

const url = "https://www.blackbox.ai/api/chat";
const headers = {
  "Content-Type": "application/json",
  Accept: "*/*",
  Origin: "https://www.blackbox.ai",
  Referer: "https://www.blackbox.ai/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
};

module.exports.run = async function ({ event, args, api }) {
  if (!args.length) {
    return api.sendMessage("الرجاء إدخال رسالة للتحدث مع الذكاء الاصطناعي.", event.senderID);
  }

  let userMessage = args.join(" ");

  let requestData = {
    id: "BNAU61V",
    messages: [{ id: "BNAU61V", content: userMessage, role: "user" }],
    agentMode: {},
    validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
  };

  try {
    let response = await axios.post(url, requestData, { headers });
    let reply = response.data?.message || "لم أتمكن من معالجة طلبك.";
    api.sendMessage(reply, event.senderID);
  } catch (error) {
    console.error("ERROR:", error.response ? error.response.data : error.message);
    api.sendMessage("حدث خطأ أثناء الاتصال بـ Blackbox AI.", event.senderID);
  }
};
