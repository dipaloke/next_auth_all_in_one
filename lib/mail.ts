import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  //this is the confirmation link will be sent to users.
  const confirmLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Please verify your email within an hour.",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
  });
};