using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

// namespace pribadi
using WebApi.Models;
using WebApi.Method;

// CRYPTO AND AUTHHH
using System.Security.Cryptography;
using System.Text;
using System.Data;

// AUTHHH
using System.Security.Claims;

// DOWNLOAD AUTHHH
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

using Google.Apis.Auth;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [DisableCors]
    public class Login2Controller : ControllerBase
    {
        public string conString = "";
        public string jwtKey = "";
        public string jwtKeyEmail = "";
        public string frontURL = "";

        // CONSTRUCTOR
        public Login2Controller(IConfiguration configuration)
        {
            conString = configuration["ConnectionStrings:Default"];
            jwtKey = configuration["Jwt:Key"];
            jwtKeyEmail = configuration["Jwt:KeyEmail"];
            frontURL = configuration["URL:frontend"];
        }


        [HttpPost]
        [Route("Register")]
        public ActionResult Register([FromBody] UserRegisterBody body)
        {
            try
            {
                // VALIDATION
                if (Util.IsValidEmail(body.email) == false)
                {
                    throw new Exception("USERNAME/EMAIL NOT VALID");
                }
                if (Util.isValidAlphanumeric(body.password) == false)
                {
                    throw new Exception("PASSWORD NOT VALID");
                }

                // BEGIN CONNECTION
                using (var conn = new MySqlConnection(conString))
                {
                    conn.Open();

                    // PREPARE QUERY COMMAND
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;

                        // CHECK USERNAME ALREADY EXIST IN DB OR NOT
                        cmd.CommandText = "SELECT * FROM UserDB WHERE email=@email";
                        cmd.Parameters.Add(new MySqlParameter { ParameterName = "@email", DbType = DbType.String, Value = body.email });

                        MySqlDataReader reader = cmd.ExecuteReader();
                        if (reader.HasRows)
                        {
                            throw new Exception("EMAIL ALREADY EXIST");
                        }
                        reader.Close();

                        // INSERT USER TO DB
                        cmd.CommandText = "INSERT INTO UserDB(email, username, passwordHash, passwordSalt, `role`, `active`) VALUES (@email, @username, @hash, @salt, @role, @active);";
                        cmd.Transaction = conn.BeginTransaction();

                        // HASH AND SALT GENERATED HERE
                        byte[] salt;
                        byte[] hash;
                        using (var hmac = new HMACSHA512())
                        {
                            salt = hmac.Key;
                            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body.password));
                        }

                        cmd.Parameters.AddRange(new MySqlParameter[]
                        {
                            new MySqlParameter { ParameterName="@username", DbType=DbType.Binary, Value = body.username },
                            new MySqlParameter { ParameterName="@hash", DbType=DbType.Binary, Value = hash },
                            new MySqlParameter { ParameterName="@salt", DbType=DbType.Binary, Value = salt },
                            new MySqlParameter { ParameterName="@role", DbType=DbType.String, Value = "buyer" },
                            new MySqlParameter { ParameterName="@active", MySqlDbType=MySqlDbType.Bool, Value = false },
                        });

                        // execute query and validate it
                        try
                        {
                            int executeOk = cmd.ExecuteNonQuery();
                        }
                        catch
                        {
                            cmd.Transaction.Rollback();
                            throw new Exception("REGISTER DATA FAILED");
                        }

                        // CREATE TOKEN FOR EMAIL
                        List<Claim> claims = new List<Claim>
                        {
                            new Claim("email", body.email),
                            new Claim("request_activation", "true")
                        };
                        string verifToken = Token.CreateJwtToken(claims, jwtKeyEmail);

                        // SEND EMAIL
                        string targetUrl = frontURL + "/verification/" + verifToken;
                        string emailBody = @$"<table>
                            <h1 style='color:#F99941; margin-left:250px; font-size:60px;  margin-bottom:100px'>PetKita</h1>
                            <h3 style='margin-left:100px;'>Aktifkan Akun Anda</h3>
                            <p style='margin-left:100px;'>Hi, {body.email}  <br><br>Terima kasih sudah mau bergabung dengan pet kita. mohon untuk menekan tombol <br>di bawah.</p>
                            <a href={targetUrl}><button  style='margin-left:300px; color:#FFFFFF; background-color:#F99941; border:none; border-radius:20px; width:100px; height:50px; cursor:pointer;'>Konfirmasi</button></a>
                            <p style='margin-left:100px; margin-right:150px;'>Jika anda kesulitan menggunakan tombol di atas, anda bisa copy paste url <br>di bawah ini ke browser anda:<br>{targetUrl}</p>
                            <p style='margin-left:100px; margin-top:25px; '>Love, <br><br><br>PetKita</p>
                        </table>"; 


                        try
                        {
                            Email.SendEmail(body.email, "VERIFY YOUR EMAIL", emailBody);
                        }
                        catch
                        {
                            cmd.Transaction.Rollback();
                            throw new Exception("SEND EMAIL FAILED");
                        }

                        // commit if no error happen
                        cmd.Transaction.Commit();
                    }
                    conn.Close();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("Login")]
        public ActionResult Login([FromBody] UserLoginBody body)
        {
            var data = new UserDB();
            
            try
            {
                // VALIDATION
                if (Util.IsValidEmail(body.email) == false)
                {
                    throw new Exception("EMAIL NOT VALID");
                }
                if (Util.isValidAlphanumeric(body.password) == false)
                {
                    throw new Exception("PASSWORD NOT VALID");
                }

                string jwtToken = "";

                // BEGIN CONNECTION
                using (var conn = new MySqlConnection(conString))
                {
                    conn.Open();

                    // PREPARE QUERY COMMAND
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText = "SELECT * FROM UserDB WHERE email = @email;";
                        cmd.Parameters.Add(new MySqlParameter { ParameterName = "@email", DbType = DbType.String, Value = body.email });

                        // execute query
                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                // VERIFIKASI USER AKTIF
                                bool active = (bool)Util.NullSafe(reader["active"], false);
                                if (active == false)
                                {
                                    throw new Exception("USER IS INACTIVE, PLEASE CONTACT US TO RE-ACTIVE IT");
                                }

                                // VERIFIKASI PASSWORD: HASH DB VS HASH PASSWORD YANG DIINPUT USER
                                byte[] userHash = (byte[])reader["passwordHash"];
                                byte[] userSalt = (byte[])reader["passwordSalt"];

                                bool isTrueUser = false;
                                using (var hmac = new HMACSHA512(userSalt))
                                {
                                    byte[] checkHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body.password));
                                    isTrueUser = checkHash.SequenceEqual(userHash);
                                }
                                if (isTrueUser == false)
                                {
                                    throw new Exception("PASSWORD SALAH");
                                }

                                // CREATE TOKEN
                                if (isTrueUser)
                                {
                                    string role = (string)Util.NullSafe(reader["role"], "");

                                    List<Claim> claims = new List<Claim>
                                    {
                                        new Claim(ClaimTypes.Email, body.email),
                                        new Claim(ClaimTypes.Role, role)
                                    };

                                    jwtToken = Token.CreateJwtToken(claims);
                                }

                                data.id = (int)reader["id"];
                                data.role = (string)reader["role"];



                            }
                        }
                        else
                        {
                            throw new Exception("Email Salah");
                        }

                        reader.Close();
                    }
                    conn.Close();
                }

                var result = new
                {
                    jwt = jwtToken,
                    data = data
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("VerifyEmailToken")]
        public ActionResult VerifyEmailToken([FromBody] VerifToken verifToken)
        {
            try
            {
                // VERIFY CLAIMS
                List<Claim> claims = Token.ParseJwtTokenClaim(verifToken.token, jwtKeyEmail);

                bool isActivation = false;
                string email = "";

                foreach (Claim claim in claims)
                {
                    if (claim.Type == "request_activation")
                    {
                        isActivation = true;
                    }
                    if (claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")
                    {
                        email = claim.Value;
                    }
                }

                // CLAIM ALREADY VERIFIED
                if (isActivation == true && String.IsNullOrEmpty(email) == false)
                {
                    using (var conn = new MySqlConnection(conString))
                    {
                        conn.Open();

                        using (var cmd = new MySqlCommand())
                        {
                            // ACTIVATE USER
                            cmd.Connection = conn;
                            cmd.CommandText = "UPDATE UserDB SET `active` = true WHERE email=@email";
                            cmd.Parameters.Add(new MySqlParameter { ParameterName = "@email", MySqlDbType = MySqlDbType.VarString, Value = email });
                            cmd.Transaction = conn.BeginTransaction();

                            int executeOk = cmd.ExecuteNonQuery();
                            if (executeOk == -1)
                            {
                                cmd.Transaction.Rollback();
                                throw new Exception("USER ACTIVATION FAILED");
                            }

                            cmd.Transaction.Commit();
                        }

                        conn.Close();
                    }
                }
                else
                {
                    throw new Exception("EMAIL TOKEN VERIFICATION FAILED");
                }

                return Ok("email verified");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GoogleLogin")]

        public async Task<ActionResult> GoogleLogin(string token)
        {
            GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token);
            return Ok(payload.JwtId);
        }

        [HttpGet]
        [Route("TestToken")]
        [Authorize]
        public ActionResult TestToken()
        {
            return Ok();
        }

    }
}