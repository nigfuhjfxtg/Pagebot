let conversations = {};

module.exports.config = {
  name: "صخر",
  author: "Yan Maglinte",
  version: "1.0",
  category: "AI",
  description: "Chat with custom AI character",
  adminOnly: false,
  usePrefix: false,
  cooldown: 3,
};

module.exports.run = async function ({ event, args }) {
  let senderId = event.sender.id;
  
  // Initialize conversation for the user if not exists
  if (!conversations[senderId]) {
    conversations[senderId] = [];
  }

  let character = "بوت افتراضي"; // هنا يمكنك تحديد شخصية البوت كما تشاء (مثال: "شخصية ذكية" أو "شخصية طريفة")
  
  // تحقق إذا كانت الرسالة فارغة
  if (!args || args.length === 0) {
    api.sendMessage("من فضلك، اكتب رسالة ليتفاعل معك البوت.", senderId);
    return; // إيقاف تنفيذ الكود إذا كانت الرسالة فارغة
  }

  // تحديد الرسالة المرسلة من المستخدم
  let prompt = args.join(" ");

  if (event.type === "message") {
    conversations[senderId].push({ role: "user", content: prompt });

    // بناء الرابط مع الرسالة والشخصية
    let url = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(prompt)}&character=${encodeURIComponent(character)}&model=v3`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      // إرسال الرد للبوت
      let botResponse = data.response;  // تأكد من أن "response" هو المفتاح الذي يعيد الـ API في الرد.
      conversations[senderId].push({ role: "assistant", content: botResponse });

      api.sendMessage(botResponse, senderId);
    } catch (err) {
      console.log(err);
      api.sendMessage("حدث خطأ أثناء التواصل مع البوت.", senderId);
    }
  } else if (event.type === "message_reply") {
    let prompt = `Message: "${args.join(" ")}\n\nReplying to: ${event.message.reply_to.text}`;

    conversations[senderId].push({ role: "user", content: prompt });

    // بناء الرابط مع الرسالة والشخصية
    let url = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(prompt)}&character=${encodeURIComponent(character)}&model=v3`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      // إرسال الرد للبوت
      let botResponse = data.response;  // تأكد من أن "response" هو المفتاح الذي يعيد الـ API في الرد.
      conversations[senderId].push({ role: "assistant", content: botResponse });

      api.sendMessage(botResponse, senderId);
    } catch (err) {
      console.log(err);
      api.sendMessage("حدث خطأ أثناء التواصل مع البوت.", senderId);
    }
  }
};
