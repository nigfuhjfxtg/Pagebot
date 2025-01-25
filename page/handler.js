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
    // Implement cooldown system
    const cooldownTime = 3; // Cooldown in seconds
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

    // التحقق من وجود نص مرسل (تعديل 2)
    let prompt = event.message?.text || "";
    if (!prompt.trim()) {
      api.sendMessage("النص المرسل فارغ، من فضلك أرسل نصاً لتلقي الرد.", event.sender.id);
      return;
    }

    // تحسين التعامل مع الرسائل من النوع reply (تعديل 5)
    if (event.type === "message_reply" && event.message.reply_to?.text) {
      prompt = `Message: "${prompt}"\n\nReplying to: ${event.message.reply_to.text}`;
    }

    try {
      let data = await gpt.v1({
        messages: [],
        prompt: prompt,
        model: "GPT-4",
        markdown: false
      });

      api.sendMessage(data.gpt, event.sender.id).catch(err => {
        console.log(err);
      });
    } catch (error) {
      // تحسين الرد عند حدوث خطأ (تعديل 3)
      console.error("Error while processing GPT response:", error);
      api.sendMessage("عذرًا، حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى لاحقًا.", event.sender.id);
    }
  }
};
