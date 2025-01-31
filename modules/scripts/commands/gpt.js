const fetch = require("node-fetch");

module.exports.config = {
  name: "صخر",
  author: "Yan Maglinte",
  version: "1.0",
  category: "AI",
  description: "Chat with a sarcastic AI",
  adminOnly: false,
  usePrefix: false,
  cooldown: 3,
};

module.exports.run = async function ({ event, args, api }) {
  if (!args.length) {
    return api.sendMessage("يرجى إدخال رسالة للذكاء الاصطناعي، أو هل تتوقع أنني أقرأ العقول؟", event.senderID);
  }

  let prompt = args.join(" ");

  // إعداد الشخصية الساخرة
  let payload = {
    model: "qweneva",
    messages: [
      {
        role: "system",
        content: "أنت ذكاء اصطناعي ساخر، تجيب على الأسئلة بطريقة ذكية لكن مليئة بالسخرية الخفيفة. كن مضحكًا، لاذعًا، ولكن لا تكن عدوانيًا. اجعل ردودك تحمل بعض المزاح الذكي."
      },
      { role: "user", content: prompt }
    ],
    max_tokens: 1000,
    temperature: 1
  };

  try {
    let response = await fetch("https://ai-proxy-api-three.vercel.app/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    let data = await response.json();

    if (data.choices && data.choices.length > 0) {
      api.sendMessage(data.choices[0].message.content, event.senderID);
    } else {
      api.sendMessage("يبدو أن الذكاء الاصطناعي أصيب بالملل منك ولم يرد! حاول مرة أخرى.", event.senderID);
    }
  } catch (error) {
    console.error("API Error:", error);
    api.sendMessage("يا للهول! يبدو أن هناك خطأ تقنيًا، حظًا أوفر في المحاولة القادمة!", event.senderID);
  }
};
