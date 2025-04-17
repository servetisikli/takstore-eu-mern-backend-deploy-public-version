import Brevo from '@getbrevo/brevo';

const sendEmail = async (options) => {
  const client = new Brevo.ApiClient();
  client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const tranEmailApi = new Brevo.TransactionalEmailsApi(client);

  const sender = {
    email: process.env.EMAIL_FROM, // Brevo'da doğrulanmış bir e-posta adresi kullanın
    name: 'TakStore.eu - Test Version',
  };

  const receivers = [
    {
      email: options.email,
    },
  ];

  const emailData = {
    sender,
    to: receivers,
    subject: options.subject,
    textContent: options.message,
  };

  try {
    await tranEmailApi.sendTransacEmail(emailData);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;