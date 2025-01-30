const axios = require('axios');
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
  // اولا التعامل مع الرسالة
  let prompt = args.join(" ");
  
  // إرسال طلب HTTP باستخدام axios
  const url = "https://www.blackbox.ai/api/chat";
  const data = {
    id: "BNAU61V",
    messages: [{ id: "BNAU61V", content: prompt, role: "user" }],
    agentMode: {},
    validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "*/*",
    Origin: "https://www.blackbox.ai",
    Referer: "https://www.blackbox.ai/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  };

  try {
    // إرسال الطلب إلى API
    const response = await axios.post(url, data, { headers });

    // بعد الحصول على رد من API، أرسل الرد للمستخدم
    const apiResponse = response.data;

    // استجابة GPT
    let gptData = await gpt.v1({
      messages: [],
      prompt: apiResponse, // استخدام الرد من الـ API كـ prompt
      model: "GPT-4",
      markdown: false
    });

    api.sendMessage(gptData.gpt, event.sender.id).catch(err => {
      console.log(err);
    });

  } catch (error) {
    console.error("ERROR:");
    console.error(error.response ? error.response.data : error.message);
  }
};
