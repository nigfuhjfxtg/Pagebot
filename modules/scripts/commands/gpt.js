const { gpt } = require("gpti");

// مصفوفة لتخزين المحادثات
const conversations = {};

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
  const userId = event.sender.id; // التعرف على المستخدم من الـ ID
  const userMessage = args.join(" "); // رسالة المستخدم

  // التأكد من وجود سجل المحادثة للمستخدم
  if (!conversations[userId]) {
    conversations[userId] = []; // إنشاء سجل جديد للمستخدم
  }

  // إضافة رسالة المستخدم إلى المحادثة
  conversations[userId].push({ role: "user", content: userMessage });

  try {
    // إرسال الطلب إلى GPT
    const data = await gpt.v1({
      messages: conversations[userId], // استخدام المحادثة الكاملة
      prompt: userMessage,
      model: "GPT-4",
      markdown: false,
    });

    const botResponse = data.gpt; // رد الروبوت

    // إضافة رد الروبوت إلى المحادثة
    conversations[userId].push({ role: "assistant", content: botResponse });

    // إرسال رد الروبوت إلى المستخدم
    api.sendMessage(botResponse, userId).catch((err) => {
      console.error(err);
    });
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى لاحقًا.", userId).catch((err) => {
      console.error(err);
    });
  }
};
