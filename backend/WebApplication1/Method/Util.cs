using System.Net.Mail;
using System.Text.RegularExpressions;

namespace WebApi.Method
{

        public static class Util
        {
            public static object NullSafe(object data, object defaultValue)
            {
                return data == DBNull.Value ? defaultValue : data;
            }

            public static bool IsValidEmail(string emailaddress)
            {
                if (String.IsNullOrEmpty(emailaddress))
                {
                    return false;
                }


                try
                {
                    MailAddress m = new MailAddress(emailaddress);

                    return true;
                }
                catch (FormatException)
                {
                    return false;
                }
            }

            // https://stackoverflow.com/questions/1046740/how-can-i-validate-a-string-to-only-allow-alphanumeric-characters-in-it
            public static bool isValidAlphanumeric(string text)
            {
                if (String.IsNullOrEmpty(text))
                {
                    return false;
                }

                Regex r = new Regex("^[a-zA-Z0-9]*$");
                if (r.IsMatch(text))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

    
}
