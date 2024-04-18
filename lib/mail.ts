import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "This authentication code will expire within 15 minutes",
    html: `<p>Your Two Factor Authentication code is : ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Please reset your password within an hour",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

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
