import nodemailer from 'nodemailer';

export const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const {email, nombre, token} = datos;

      //Enviar email

      const info = await transporter.sendMail({
        from: "APV - Administrador de Veterinaria",
        to: email,
        subject: 'Restable tu password',
        text: 'Restable tu password',
        html: `<p>Hola ${nombre}, has solicitado restableser tu password. </p>

          <p>Sigue el siguente enlace para generar un nuevo password <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a></p>

          <p>Si tu no creaste este cuenta, ignora el mensaje</p>
        
        `
      })

      console.log("Mensaje enviado: %s", info.messageId)
} 