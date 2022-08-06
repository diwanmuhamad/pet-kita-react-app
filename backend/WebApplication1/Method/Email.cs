using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;


namespace WebApi.Method
{
    public static class Email
    {
        public static IConfiguration _configuration;
        private static string _email;
        private static string _password;

        // get appsettings.json config in Program.cs
        public static void Init(IConfiguration configuration)
        {
            _configuration = configuration;
            _email = configuration["Email:Email"];
            _password = configuration["Email:Password"];
        }

        public static bool SendEmail(string emailTo, string subjectText, string bodyHtml)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_email));
                email.To.Add(MailboxAddress.Parse(emailTo));
                email.Subject = subjectText;
                email.Body = new TextPart(TextFormat.Html) { Text = bodyHtml };

                using (var smtp = new SmtpClient())
                {
                    smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    smtp.Authenticate(_email, _password);
                    smtp.Send(email);
                    smtp.Disconnect(true);
                }

                return true;
            }
            catch
            {
                throw;
            }
        }

    }

}
