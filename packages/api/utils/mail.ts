import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

import { env } from "../env.mjs";

const mailerSend = new MailerSend({
  apiKey: env.MAILERSEND_API_KEY ?? "",
});

const sentFrom = new Sender(env.MAIL_FROM_ADDRESS ?? "", "plandeprise.fr");

const sendMail = async (
  recipient: {
    email: string;
    name: string;
  },
  subject: string,
  templateId?: string,
  variables?: Record<string, string>,
) => {
  if (process.env.CI) {
    console.log("Skipping sending email in CI");
    return;
  }

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo([new Recipient(recipient.email, recipient.name)])
    .setReplyTo(sentFrom)
    .setSubject(subject);

  if (templateId) {
    emailParams.setTemplateId(templateId);
  }

  if (variables) {
    emailParams.setPersonalization([
      { data: variables, email: recipient.email },
    ]);
  }

  return await mailerSend.email.send(emailParams);
};

export default sendMail;
