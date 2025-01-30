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
};

module.exports.run = async function ({ event, args, api }) {
  const message = args.join(" ");
  const facebookRegex = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.(?:com|watch)\/\S+/;

  if (!facebookRegex.test(message)) {
    return api.sendMessage("❌ لا أدعم مواقع أخرى.", event.sender.id);
  }

  try {
    api.sendMessage("⏳ جارٍ تنزيل الفيديو، يرجى الانتظار...", event.sender.id);

    const apiUrl = `https://api.zetsu.xyz/facebook?url=${encodeURIComponent(message)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.video) {
      return api.sendMessage("❌ لم أتمكن من العثور على رابط التنزيل.", event.sender.id);
    }

    const videoUrl = response.data.video;
    const videoPath = path.join(__dirname, "video.mp4");

    const videoResponse = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(videoPath);
    videoResponse.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: "✅ تم تنزيل الفيديو بنجاح!",
          attachment: fs.createReadStream(videoPath),
        },
        event.sender.id,
        () => fs.unlinkSync(videoPath) // حذف الملف بعد الإرسال
      );
    });

    writer.on("error", () => {
      api.sendMessage("❌ حدث خطأ أثناء حفظ الفيديو.", event.sender.id);
    });

  } catch (error) {
    api.sendMessage("❌ حدث خطأ أثناء تنزيل الفيديو.", event.sender.id);
    console.error(error);
  }
};
