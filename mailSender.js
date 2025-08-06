const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "smhtrn2016@gmail.com",
    pass: "lydkrlkegeqbdbbc"
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 🔧 Bu fonksiyon eksikse veya doğru export edilmemişse hata alırsın!
async function sendNotificationEmail(toEmails, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Numune Takip Sistemi" <smhtrn2016@gmail.com>',
      to: toEmails.join(", "),
      subject: subject,
      html: html
    });

    console.log("Mail gönderildi:", info.messageId);
    return true;
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return false;
  }
}

// ✅ Fonksiyonu export ediyoruz
module.exports = sendNotificationEmail;
