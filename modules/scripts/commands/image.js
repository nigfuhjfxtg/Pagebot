const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "تحميل_فيديو",
  author: "Yan Maglinte",
  version: "1.1",
  category: "Utility",
  description: "يقوم بتنزيل فيديوهات فيسبوك عند إرسال رابط",
  usePrefix: true,
  cooldown: 0,
  adminOnly: false // ✅ تمت إضافة الخاصية المطلوبة
};
module.exports.run = async function ({ event, args, api }) {
  const message = args.join(" ");
  const facebookRegex = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.(?:com|watch)\/\S+/;

  console.log("📩 رسالة مستلمة:", message); // ✅ تتبع استقبال الرسالة

  if (!facebookRegex.test(message)) {
    console.log("❌ ليس رابط فيسبوك!");
    return api.sendMessage("❌ لا أدعم مواقع أخرى.", event.sender.id);
  }

  try {
    console.log("⏳ محاولة تنزيل الفيديو...");
    api.sendMessage("⏳ جارٍ تنزيل الفيديو، يرجى الانتظار...", event.sender.id);

    const apiUrl = `https://api.zetsu.xyz/facebook?url=${encodeURIComponent(message)}`;
    console.log("🔗 طلب API:", apiUrl);

    const response = await axios.get(apiUrl);
    console.log("✅ استجابة API:", response.data);

    if (!response.data || !response.data.video) {
      console.log("⚠️ لم يتم العثور على رابط الفيديو.");
      return api.sendMessage("❌ لم أتمكن من العثور على رابط التنزيل.", event.sender.id);
    }

    const videoUrl = response.data.video;
    console.log("🎥 رابط الفيديو:", videoUrl);

    const videoPath = path.join(__dirname, "video.mp4");
    console.log("📂 سيتم حفظ الفيديو في:", videoPath);

    const videoResponse = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(videoPath);
    videoResponse.data.pipe(writer);

    writer.on("finish", () => {
      console.log("✅ تم تنزيل الفيديو بنجاح!");
      api.sendMessage(
        {
          body: "✅ تم تنزيل الفيديو بنجاح!",
          attachment: fs.createReadStream(videoPath),
        },
        event.sender.id,
        () => fs.unlinkSync(videoPath) // حذف الملف بعد الإرسال
      );
    });

    writer.on("error", (err) => {
      console.log("❌ خطأ أثناء حفظ الفيديو:", err);
      api.sendMessage("❌ حدث خطأ أثناء حفظ الفيديو.", event.sender.id);
    });

  } catch (error) {
    console.log("❌ خطأ أثناء تنفيذ الطلب:", error);
    api.sendMessage("❌ حدث خطأ أثناء تنزيل الفيديو.", event.sender.id);
  }
};
