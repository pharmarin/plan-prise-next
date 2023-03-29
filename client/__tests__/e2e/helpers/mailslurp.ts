import MailSlurp from "mailslurp-client";

const mailslurp = new MailSlurp({
  apiKey: process.env.MAILSLURP_API_KEY || "",
});

export default mailslurp;
