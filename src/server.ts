import express from "express";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6d3dddf6473194",
    pass: "ff4e0666de8dd1",
  },
});

app.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;
  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Poly Tuag <pollyportugues@hotmail.com>",
    subject: "Novo feedback",
    html: [
      `<div style='font-family: sans-serif; font-size: 16px; color: #111;'>`,
      `<p>Novo feedback recebido!</p>`,
      `<p>Tipo: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`,
    ].join("\n"),
  });

  return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
  console.log("Server started on port 3333");
});
