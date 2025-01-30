module.exports.config = {
  name: 'The Script of Everything',
  author: 'Yan Maglinte',
  version: '1.0',
  description: 'Allows you to input code here without the need for prefixes or names; it will execute automatically.',
  selfListen: false,
};

let enter = false;
module.exports.run = async function({ event, args }) {
  if (event.type === 'message' && !enter) {
    api.graph({
      recipient: {
        id: event.sender.id
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'مرحبا ايها المستخدم!', // عنوان الرسالة
                subtitle: 'شكرا لك لأستخدامك زيرو جيبيتي 🎉 اتمنى منك دعمنا بلايك للصفحة.', // نص الترحيب
                image_url: 'https://i.ibb.co/8gf7KLcw/20250127-215950.jpg', // رابط الصورة
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.facebook.com/61567181097397',
                    title: 'حساب المطور'
                  }
                ]
              }
            ]
          }
        }
      }
    });

    enter = true; // تعيين `enter` لمنع التكرار

    // إعادة تعيين `enter` بعد 10 ثوانٍ حتى يعمل مع مستخدمين آخرين
    setTimeout(() => {
      enter = false;
    }, 1000000);
  }
};
