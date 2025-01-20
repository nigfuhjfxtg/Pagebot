const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const { gpt } = require("gpti");
const sqlite3 = require("sqlite3").verbose(); // SQLite
const cooldowns = {}; // Track cooldowns for each user and command

// إعداد قاعدة البيانات
const dbPath = path.resolve(__dirname, "chat_history.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// إنشاء جدول المحادثات إذا لم يكن موجودًا
db.run(
  `CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    }
  }
);

module.exports = async function (event) {
  const isAdmin = config.ADMINS.includes(event.sender.id);

  if (event?.message?.is_echo) {
    event.sender.id = event.recipient.id;
  }

  if (config.markAsSeen) {
    api.markAsSeen(true, event.threadID).catch((err) => console.error(err));
  }

  if (event.type === "message" || event.type === "message_reply") {
    // نظام التبريد (Cooldown system)
    const cooldownTime = 3; // Cooldown in seconds
    const userCooldown = cooldowns[event.sender.id] || {};
    const lastUsed = userCooldown["لونا"] || 0;
    const now = Date.now();

    if (cooldownTime > 0 && now - lastUsed < cooldownTime * 1000) {
      const remainingTime = Math.ceil(
        (cooldownTime * 1000 - (now - lastUsed)) / 1000
      );
      api.sendMessage(
        `من فضلك انتظر ${remainingTime} ثانية قبل إرسال رسالة جديدة.`,
        event.sender.id
      );
      return;
    }

    cooldowns[event.sender.id] = {
      ...userCooldown,
      "لونا": now,
    };

    let prompt = event.message?.text || "";
    if (event.type === "message_reply") {
      prompt = `Message: "${prompt}"\n\nReplying to: ${event.message.reply_to.text}`;
    }

    try {
      // إرسال الطلب إلى GPT
      let data = await gpt.v1({
        messages: [],
        prompt: prompt,
        model: "GPT-4",
        markdown: false,
      });

      const botResponse = data.gpt;

      // حفظ المحادثة في قاعدة البيانات
      db.run(
        `INSERT INTO chat_history (user_id, user_message, bot_response) VALUES (?, ?, ?)`,
        [event.sender.id, prompt, botResponse],
        (err) => {
          if (err) {
            console.error("Error saving chat to database:", err.message);
          } else {
            console.log("Chat saved to database.");
          }
        }
      );

      // إرسال الرد إلى المستخدم
      api.sendMessage(botResponse, event.sender.id).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.error("Error while processing GPT response:", error);
    }
  }
};
