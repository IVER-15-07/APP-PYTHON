import nodemailer from "nodemailer";


export const sendVerificationCode = async (userEmail, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: '"PyLearn" <no-reply@pylearn>',
    to: userEmail,
    subject: "Código de verificación",
    html: `
      <h2>Tu código de verificación</h2>
      <p>Válido por 15 minutos.</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</div>
    `,
  });
};
