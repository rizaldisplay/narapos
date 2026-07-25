import nodemailer from 'nodemailer';

// Fungsi untuk membuat transporter Ethereal (hanya untuk development)
async function createTestTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  console.log('📬 Akun Ethereal (untuk testing):');
  console.log(`User: ${testAccount.user}`);
  console.log(`Pass: ${testAccount.pass}`);

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // user Ethereal
      pass: testAccount.pass, // password Ethereal
    },
  });
}

// Fungsi utama untuk mengirim email
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = await createTestTransporter();

    const info = await transporter.sendMail({
      from: '"Admin Sistem" <noreply@sistem.com>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error sending email:', error);
  }
};