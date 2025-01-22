const { gpt } = require("gpti");
const axios = require("axios");

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

module.exports.run = async function ({ event, args, api }) {
  if (event.type === "message") {
    let prompt = args.join(" ");

    // إعداد البيانات لطلب Blackbox API
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
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    };

    try {
      // إرسال الطلب إلى Blackbox API
      const response = await axios.post(url, data, { headers });

      // إرسال الرد إلى المستخدم
      api.sendMessage(response.data, event.sender.id).catch((err) => {
        console.error(err);
      });
    } catch (error) {
      console.error("ERROR:");
      console.error(error.response ? error.response.data : error.message);
      api.sendMessage("حدث خطأ أثناء معالجة الطلب.", event.sender.id).catch((err) => {
        console.error(err);
      });
    }
  }
};
