import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationCode = async (email, code) => {
  try {
    await resend.emails.send({
      from: "PyLearn <pylearn@resend.dev>",
      to: email,
      subject: "Código de verificación",
      html: `
        <h2>Tu código de verificación</h2>
        <p>Válido por 15 minutos.</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</div>
      `,
    });
  } catch (err) {
    console.error("Error enviando correo:", err);
    throw new Error("No se pudo enviar el correo");
  }
};
