const { gpt } = require("gpti");
let conversations = {};

module.exports.config = {
  name: "صخر",
  author: "Yan Maglinte",
  version: "1.0",
  category: "AI",
  description: "Chat with GPT",
  adminOnly: false,
  usePrefix: false,
  cooldown: 3,
};

module.exports.run = async function ({ event, args }) {
  let senderId = event.sender.id;

  // إنشاء محادثة جديدة إذا لم تكن موجودة
  if (!conversations[senderId]) {
    conversations[senderId] = [];
  }

  if (event.type === "message") {
    let prompt = event.body; // استخدام نص الرسالة بالكامل

    conversations[senderId].push({ role: "user", content: prompt });

    let data = await gpt.v1({
      messages: conversations[senderId],
      model: "GPT-4",
      markdown: false
    });

    conversations[senderId].push({ role: "assistant", content: data.gpt });

    api.sendMessage(data.gpt, senderId).catch(err => {
      console.log(err);
    });

  } else if (event.type === "message_reply") {
    let prompt = `Message: "${event.body}"\n\nReplying to: ${event.message.reply_to.text}`;

    conversations[senderId].push({ role: "user", content: prompt });

    let data = await gpt.v1({
      messages: conversations[senderId],
      model: "GPT-4",
      markdown: false
    });

    conversations[senderId].push({ role: "assistant", content: data.gpt });

    api.sendMessage(data.gpt, senderId).catch(err => {
      console.log(err);
    });
  }
};
