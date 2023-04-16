import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

const sentFrom = new Sender(
  process.env.MAIL_FROM_ADDRESS || "",
  process.env.APP_NAME
);

const sendMail = async (
  recipient: {
    email: string;
    name: string;
  },
  subject: string,
  templateId?: string,
  variables?: { [key: string]: string }
) => {
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
