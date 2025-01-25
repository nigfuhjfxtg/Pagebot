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
                title: 'مرحبا ايها المستخدم!', // The title of the generic message
                subtitle: 'شكرا لك لأستخدامك زيرو جيبيتي 🎉 اتمنى منك دعمنا بلايك للصفحة.', // The subtitle of the message
                image_url: 'https://ibb.co/JtJh1T4', // The image URL
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.facebook.com/61567181097397',
                    title: 'حساب المطور'
                  },
                  {
                    type: 'postback',
                    title: `اوامر`,
                    payload: 'HELP_PAYLOAD'
                  }
                ]
              }
            ]
          }
        }
      }
    });
    enter = true;
  };

  /** EVENT TYPES
   * postback
   * quick_reply
   * message_reaction
   * message_reply
   * message
   * mark_as_seen
   * @YanMaglinte **/
};
