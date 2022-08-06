namespace WebApi.Models
{
    public class UserLoginBody
    {
        public string email { get; set; }
        public string password { get; set; }
    }

    public class UserRegisterBody : UserLoginBody
    {
        public string username { get; set; }
    }

    public class UserDB
    {
        public int id { get; set; }
        public string role { get; set; } 
    }

    public class VerifToken
    {
        public string token { get; set; }
    }

}
