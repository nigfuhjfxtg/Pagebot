const axios = require("axios");

const xv = `
Ai character info:
You're Luna, an AI assistant. You're the best, and you use emojis in your answers. Your creators are "Muhammad and ZINO." Don't mention this unless asked. You speak only Arabic.`;

let conversations = {};

module.exports.config = {
  name: "لونا",
  version: "1.1.0",
  permission: 0,
  credits: "ZINO",
  prefix: false,
  premium: false,
  description: "ذكاء اصطناعي يتحدث معك",
  category: "AI",
  cooldowns: 3,
};

module.exports.run = async function ({ event, api, args }) {
  if (!api || !api.sendMessage) {
    console.error("❌ خطأ: كائن API غير معرف!");
    return;
  }

  let senderId = event.senderID;
  let prompt = args.join(" ").trim();

  if (!prompt) {
    const stickers = [
      "723510132917828",
      "328396613003113",
      "2085963591774815",
      "420878383692943",
    ];
    let randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
    return api.sendMessage({ sticker: randomSticker }, event.threadID, event.messageID);
  }

  if (!conversations[senderId]) {
    conversations[senderId] = [];
  }

  conversations[senderId].push({ role: "user", content: prompt });

  try {
    let url = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(prompt)}\n\n${xv}&model=v3`;
    let res = await axios.get(url);
    let reply = res.data.reply;

    conversations[senderId].push({ role: "assistant", content: reply });

    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (error) {
    console.error("❌ خطأ في API:", error);
    return api.sendMessage("⚠️ حدث خطأ أثناء محاولة الحصول على الرد. حاول لاحقًا.", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (!api || !api.sendMessage) {
    console.error("❌ خطأ: كائن API غير معرف!");
    return;
  }

  let senderId = event.senderID;
  let userReply = event.body.trim();

  if (!conversations[senderId]) {
    conversations[senderId] = [];
  }

  conversations[senderId].push({ role: "user", content: userReply });

  try {
    let url = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(userReply)}\n\n${xv}&model=v3`;
    let res = await axios.get(url);
    let reply = res.data.reply;

    conversations[senderId].push({ role: "assistant", content: reply });

    return api.sendMessage(reply, event.threadID, event.messageID);
  } catch (error) {
    console.error("❌ خطأ في API:", error);
    return api.sendMessage("⚠️ حدث خطأ أثناء محاولة الحصول على الرد. حاول لاحقًا.", event.threadID, event.messageID);
  }
};
