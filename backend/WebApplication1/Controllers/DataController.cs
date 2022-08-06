using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;
using WebApi.Models;
using WebApi.Method;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [DisableCors]
    public class DataController : ControllerBase
    {
        private IConfiguration _configuration;
        private string _conString = "";

        public DataController(IConfiguration configuration)
        {
            _configuration = configuration;
            _conString = configuration["ConnectionStrings:Default"];
        }


        [HttpGet]
        [Route("GetProduct")]
        public ActionResult GetProduct(string? search, string? sort, string? all, string? dog, string? cat, string? bird, string? hamster, int min = 0, int max = 0, int page = 1, int offset = 0)
        {
            try
            {
                var result = CRUD.GetProduct(_conString, search, sort, all, dog, cat, bird, hamster, min, max, page, offset);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetProductDetails")]
        public ActionResult GetProductDetails(int id, int limit = 0)
        {
            try
            {
                var result2 = new List<Product>();
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = con;
                        if (limit == 0)
                        {
                            cmd.CommandText = "Select * From producttable where product_id = @id";
                     
                        }
                        else
                        {
                            cmd.CommandText = "select * from producttable where category like (select category from producttable where product_id = @id) AND product_id != @id LIMIT 4";
                        }

                        cmd.Parameters.Add(new MySqlParameter { ParameterName = "@id", MySqlDbType = MySqlDbType.Int32, Value = id });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var result = new Product();
                                result.product_id = reader["product_id"] == DBNull.Value ? 0 : (int)reader["product_id"];
                                result.name = reader["name"] == DBNull.Value ? "" : (string)reader["name"];
                                result.desc = reader["desc"] == DBNull.Value ? "" : (string)reader["desc"];
                                result.price = reader["price"] == DBNull.Value ? 0 : (int)reader["price"];
                                result.category = reader["category"] == DBNull.Value ? "" : (string)reader["category"];
                                result.keywords = reader["keywords"] == DBNull.Value ? "" : (string)reader["keywords"];
                                result.image_content = reader["image_content"] == DBNull.Value ? "" : (string)reader["image_content"];
                                result.quantity = reader["quantity"] == DBNull.Value ? 0 : (int)reader["quantity"];

                                result2.Add(result);
                            }
                        }

                        reader.Close();
                    }
                    con.Close();
                }
                    return Ok(result2);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("PostProduct")]
        [Authorize]
        public ActionResult PostProduct([FromBody] ProductPost product)
        {
            try
            {
                if (product.action_type == "add")
                {
                    CRUD.AddProduct(_conString, product);
                }
                else if (product.action_type == "delete")
                {
                    CRUD.deleteProduct(_conString, product);
                }
                else if (product.action_type == "edit")
                {
                    CRUD.editProduct(_conString, product);
                }
                
                return Ok("success");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [HttpGet]
        [Route("GetOrder")]
        public ActionResult GetOrder(int user_id)
        {
            try
            {
                var result = 0;
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.CommandText = "Select MAX(order_invoice) from invoice where fk_user_id = @userid";
                        cmd.Connection = con;
                        cmd.Parameters.Add(new MySqlParameter { ParameterName = "@userid", MySqlDbType = MySqlDbType.Int32, Value = user_id });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while(reader.Read())
                            {
                                result = reader["MAX(order_invoice)"] == DBNull.Value ? 0 : (int)reader["MAX(order_invoice)"];
                            }
                        }
                        reader.Close();
                    }
                    con.Close();   
                }
                    return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("PostCart")]

        public ActionResult PostCart([FromBody] OrderBody body)
        {
            try
            {
                if (body.action == "add")
                {
                    CRUD.postProductCart(_conString, body);
                }
                if (body.action == "edit")
                {
                    CRUD.UpdateProductCart(_conString, body);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetCart")]
        public ActionResult GetCart(int user_id, int order)
        {
            try
            {
                var result = CRUD.GetCart(_conString, user_id, order);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("PostInvoice")]
        public ActionResult PostInvoice([FromBody] InvoiceBody body)
        {
            try
            {
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.Transaction = con.BeginTransaction();
                        cmd.CommandText = "Insert into invoice(order_invoice, fk_user_id, no_invoice, buy_date, total_product, total_price, address, `number`, payment) values(@order, @user, @invoice, @date, @topro, @topri, @address, @number, @payment)";
                        cmd.Parameters.AddRange(new MySqlParameter[]
                        {
                            new MySqlParameter {ParameterName="@order", MySqlDbType=MySqlDbType.Int32, Value=body.order_invoice},
                            new MySqlParameter {ParameterName="@user", MySqlDbType=MySqlDbType.Int32, Value=body.fk_user_id},
                            new MySqlParameter {ParameterName="@invoice", MySqlDbType=MySqlDbType.String, Value=body.no_invoice},
                            new MySqlParameter {ParameterName="@date", MySqlDbType=MySqlDbType.String, Value=body.buy_date},
                            new MySqlParameter {ParameterName="@topro", MySqlDbType=MySqlDbType.Int32, Value=body.total_product},
                            new MySqlParameter {ParameterName="@topri", MySqlDbType=MySqlDbType.Int32, Value=body.total_price},
                            new MySqlParameter {ParameterName="@address", MySqlDbType=MySqlDbType.String, Value=body.address},
                            new MySqlParameter {ParameterName="@number", MySqlDbType=MySqlDbType.String, Value=body.number},
                            new MySqlParameter {ParameterName="@payment", MySqlDbType=MySqlDbType.String, Value=body.payment},
                        });
                        try
                        {
                            int res = cmd.ExecuteNonQuery();
                            if (res == -1)
                            {
                                cmd.Transaction.Rollback();
                            }
                            else
                            {
                                cmd.Transaction.Commit();
                            }
                        }
                        catch
                        {
                            cmd.Transaction.Rollback();
                            throw;
                        }
                    }
                    con.Close();
                }
                
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetInvoice")]
        public ActionResult GetInvoice(int user_id)
        {
            try
            {
                var result = new List<InvoiceBody>();
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandText = "Select * from invoice where fk_user_id = @user_id";
                        cmd.Parameters.Add(new MySqlParameter { ParameterName = "@user_id", MySqlDbType = MySqlDbType.Int32, Value = user_id });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while (reader.Read()) 
                            {
                                var temp = new InvoiceBody();
                                temp.order_invoice = (int)reader["order_invoice"];
                                temp.fk_user_id = (int)reader["fk_user_id"];
                                temp.no_invoice = (string)reader["no_invoice"];
                                temp.buy_date = (string)reader["buy_date"].ToString();
                                temp.total_price = (int)reader["total_price"];
                                temp.total_product = (int)reader["total_product"];

                                result.Add(temp);

                            }
                        }
                        reader.Close();
                    }
                    con.Close();
                }

                    return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("GetInvoiceDetails")]
        public ActionResult GetInvoiceDetails(int user_id, int order)
        {
            try
            {
                var result = new List<InvoiceDetailsBody>();
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandText = "select * from invoice as i join cart as c join producttable as pt where i.order_invoice = @order AND i.fk_user_id = @user_id AND i.order_invoice = c.`order` AND i.fk_user_id = c.fk_user_id AND c.fk_product_id = pt.product_id";
                        cmd.Parameters.AddRange(new MySqlParameter[] {
                            new MySqlParameter { ParameterName = "@user_id", MySqlDbType = MySqlDbType.Int32, Value = user_id },
                            new MySqlParameter { ParameterName = "@order", MySqlDbType = MySqlDbType.Int32, Value = order }
                        });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            var count = 1;
                            while (reader.Read())
                            {
                                var temp = new InvoiceDetailsBody();
                                temp.no = count;
                                temp.name = (string)reader["name"];
                                temp.category = (string)reader["category"];
                                temp.quantity = (int)reader["quantity_cart"];
                                temp.price = (int)reader["price"];
                                temp.buy_date = (string)reader["buy_date"].ToString();
                                temp.total_price = (int)reader["total_price"];
                                temp.no_invoice = (string)reader["no_invoice"]; 

                                result.Add(temp);
                                count++;

                            }
                        }
                        reader.Close();
                    }
                    con.Close();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteCart")]

        public ActionResult DeleteCart(int product_id, int user_id, int order)
        {
            try
            {
                using (var conn = new MySqlConnection(_conString))
                {
                    conn.Open();
                    

                    // prepare query command
                    
                        using (var cmd = new MySqlCommand())
                        {
                            cmd.Connection = conn;
                            cmd.Transaction = conn.BeginTransaction();
                            cmd.CommandText = "DELETE FROM cart " +
                                    "WHERE fk_product_id = @product_id AND fk_user_id = @user_id AND `order` = @order;";

                            cmd.Parameters.AddRange(new MySqlParameter[] {
                                new MySqlParameter  { ParameterName = "@product_id", MySqlDbType = MySqlDbType.Int32, Value = product_id },
                                new MySqlParameter  { ParameterName = "@user_id", MySqlDbType = MySqlDbType.Int32, Value = user_id },
                                new MySqlParameter  { ParameterName = "@order", MySqlDbType = MySqlDbType.Int32, Value = order },
                            });

                            try
                            {
                                int res = cmd.ExecuteNonQuery();
                                if (res == -1)
                                {
                                    cmd.Transaction.Rollback();
                                }
                                else
                                {
                                    cmd.Transaction.Commit();
                                }
                            }
                            catch
                            {
                                cmd.Transaction.Rollback();
                                throw;
                            }

                        }
                    
                    
                   
                    conn.Close();
                }
                return Ok();
            }
            catch
            {
                throw;
            }
        }

        [HttpPost]
        [Route("UpdateQuantity")]

        public ActionResult UpdateQuantity(int product_id, int quantity)
        {
            try
            {
                using (var conn = new MySqlConnection(_conString))
                {
                    conn.Open();


                    // prepare query command

                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.Transaction = conn.BeginTransaction();
                        cmd.CommandText = "update producttable set quantity = quantity - @quantity, soldcount = soldcount + @quantity " + 
                                "WHERE product_id = @product_id;";

                        cmd.Parameters.AddRange(new MySqlParameter[] {
                                new MySqlParameter  { ParameterName = "@product_id", MySqlDbType = MySqlDbType.Int32, Value = product_id },
                                new MySqlParameter  { ParameterName = "@quantity", MySqlDbType = MySqlDbType.Int32, Value = quantity },
                            });

                        try
                        {
                            int res = cmd.ExecuteNonQuery();
                            if (res == -1)
                            {
                                cmd.Transaction.Rollback();
                            }
                            else
                            {
                                cmd.Transaction.Commit();
                            }
                        }
                        catch
                        {
                            cmd.Transaction.Rollback();
                            throw;
                        }

                    }



                    conn.Close();
                }
                return Ok();
            }
            catch
            {
                throw;
            }
        }

        [HttpGet]
        [Route("GetProductAdmin")]
        public ActionResult GetProductAdmin(int offset, string? search)
        {
            try
            {
                var result = new List<Product>();
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    var query = "select * from producttable";
                    using (var cmd = new MySqlCommand())
                    {
                        if (!String.IsNullOrEmpty(search))
                        {
                            var newSearch = "";
                            newSearch = Regex.Replace(search, @"\s+", " ");
                            newSearch = Regex.Replace(search, "[^A-Za-z0-9 ]", "");
                            newSearch = newSearch.Trim();
                            newSearch = newSearch.Replace(" ", "|");

                            query += " WHERE (`name` REGEXP @search OR `keywords` REGEXP @search)";
                            cmd.Parameters.Add(new MySqlParameter { ParameterName = "@search", MySqlDbType = MySqlDbType.String, Value = newSearch });
                        }

                        var data = 6;
                        var offsets = (data * (offset - 1));
                        cmd.Connection = con;
                        query += " limit @data offset @offset";
                        cmd.CommandText = query;
                        cmd.Parameters.AddRange(new MySqlParameter[] {
                            new MySqlParameter { ParameterName = "@data", MySqlDbType = MySqlDbType.Int32, Value = data },
                            new MySqlParameter { ParameterName = "@offset", MySqlDbType = MySqlDbType.Int32, Value = offsets }
                        });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            
                            while (reader.Read())
                            {
                                var tempProduct = new Product();
                                tempProduct.product_id = reader["product_id"] == DBNull.Value ? 0 : (int)reader["product_id"];
                                tempProduct.name = reader["name"] == DBNull.Value ? "" : (string)reader["name"];
                                tempProduct.desc = reader["desc"] == DBNull.Value ? "" : (string)reader["desc"];
                                tempProduct.price = reader["price"] == DBNull.Value ? 0 : (int)reader["price"];
                                tempProduct.category = reader["category"] == DBNull.Value ? "" : (string)reader["category"];
                                tempProduct.keywords = reader["keywords"] == DBNull.Value ? "" : (string)reader["keywords"];
                                tempProduct.image_content = reader["image_content"] == DBNull.Value ? "" : (string)reader["image_content"];
                                tempProduct.quantity = reader["quantity"] == DBNull.Value ? 0 : (int)reader["quantity"];

                                result.Add(tempProduct);
                               

                            }
                        }
                        reader.Close();
                    }
                    con.Close();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("GetInvoiceAdmin")]
        public ActionResult GetInvoiceAdmin(int offset)
        {
            try
            {
                var result = new List<InvoiceBodyAdmin>();
                using (var con = new MySqlConnection(_conString))
                {
                    con.Open();
                    
                    using (var cmd = new MySqlCommand())
                    {
                        var data = 6;
                        var offsets = (data * (offset - 1));
                        var query = " select * from invoice limit @data offset @offset";
                        cmd.Connection = con;
                        cmd.CommandText = query;
                        cmd.Parameters.AddRange(new MySqlParameter[] {
                            new MySqlParameter { ParameterName = "@data", MySqlDbType = MySqlDbType.Int32, Value = data },
                            new MySqlParameter { ParameterName = "@offset", MySqlDbType = MySqlDbType.Int32, Value = offsets }
                        });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            var count = 1;
                            while (reader.Read())
                            {
                                var tempProduct = new InvoiceBodyAdmin();
                                tempProduct.no = count;
                                tempProduct.no_invoice = reader["no_invoice"] == DBNull.Value ? "" : (string)reader["no_invoice"];
                                tempProduct.fk_user_id = reader["fk_user_id"] == DBNull.Value ? 0 : (int)reader["fk_user_id"];
                                tempProduct.buy_date = (string)reader["buy_date"].ToString();
                                tempProduct.total_product = reader["total_product"] == DBNull.Value ? 0 : (int)reader["total_product"];
                                tempProduct.total_price = reader["total_price"] == DBNull.Value ? 0 : (int)reader["total_price"];
                                tempProduct.address = reader["address"] == DBNull.Value ? "" : (string)reader["address"];
                                tempProduct.number = reader["number"] == DBNull.Value ? "" : (string)reader["number"];
                                tempProduct.payment = reader["payment"] == DBNull.Value ? "" : (string)reader["payment"];

                                result.Add(tempProduct);
                                count++;

                            }
                        }
                        reader.Close();
                    }
                    con.Close();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

   

}

