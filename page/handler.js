const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const { gpt } = require("gpti");
const cooldowns = {}; // Track cooldowns for each user and command

module.exports = async function (event) {
  const isAdmin = config.ADMINS.includes(event.sender.id);

  if (event?.message?.is_echo) {
    event.sender.id = event.recipient.id;
  }

  if (config.markAsSeen) {
    api.markAsSeen(true, event.threadID).catch(err => console.error(err));
  }

  if (event.type === "message" || event.type === "message_reply") {
    // نص الرسالة
    let prompt = event.message?.text || "";

    // التحقق إذا كان النص يتضمن الأمر "لونا"
    if (prompt.toLowerCase().startsWith("لونا")) {
      // نظام الـ Cooldown
      const cooldownTime = 3; // Cooldown بالثواني
      const userCooldown = cooldowns[event.sender.id] || {};
      const lastUsed = userCooldown["لونا"] || 0;
      const now = Date.now();

      if (cooldownTime > 0 && now - lastUsed < cooldownTime * 1000) {
        const remainingTime = Math.ceil((cooldownTime * 1000 - (now - lastUsed)) / 1000);
        api.sendMessage(`من فضلك انتظر ${remainingTime} ثانية قبل إرسال رسالة جديدة.`, event.sender.id);
        return;
      }

      cooldowns[event.sender.id] = {
        ...userCooldown,
        "لونا": now
      };

      try {
        // استدعاء GPT بناءً على النص بعد إزالة "لونا"
        let data = await gpt.v1({
          messages: [],
          prompt: prompt.replace("لونا", "").trim(),
          model: "GPT-4",
          markdown: false
        });

        api.sendMessage(data.gpt, event.sender.id).catch(err => {
          console.log(err);
        });
      } catch (error) {
        console.error("Error while processing GPT response:", error);
      }
    }
  }
};
