// const mailjet = require ('node-mailjet').connect('8244e719835365d03f77058ca7dfcc10', '9860cba58b6a7028465a15875825e174');
const mailjet = require ('node-mailjet').connect('03c9150ac11402d921d7126519711ac7', 'a501283852994580f7a2bb5f2d7ae875');
// const mailjet = require ('node-mailjet').connect('03c9150ac11402d921d7126519711ac7', '9860cba58b6a7028465a15875825e174');

module.exports = async (to, content) => {
  const subject = content.Subject;
  const text = content.TextPart;
  const html = content.HTMLPart;
  const task =content.TextPart;
  await mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          // "Email": "www0327333@gmail.com",
          // "Email": "tomertvc@gmail.com",
          "Email": "tomer@expertinvest.co.il",
          "Name": "Expert Ivnest Team"
        },
        "To": [
          {
            "Email": to,
            "Name": "ttt"
          }
        ],
        "Subject": subject,
        "TextPart": text,
        "HTMLPart": html,
        "CustomID": task
      }
    ]
  })
}