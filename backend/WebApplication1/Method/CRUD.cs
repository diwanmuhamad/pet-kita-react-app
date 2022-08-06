using MySqlConnector;
using System.Data;
using System.Text.RegularExpressions;
using WebApi.Models;

namespace WebApi.Method
{
    public class CRUD
    {
        public static IConfiguration _configuration;
        private static string _conString;

        // get appsettings.json config in Program.cs
        public static void Init(IConfiguration configuration)
        {
            _configuration = configuration;
            _conString = configuration["ConnectionStrings:Default"];
        }

        public static bool AddProduct(string conString, ProductPost product)
        {
            try
            {
                // prepare connection
                using (var conn = new MySqlConnection(conString))
                {
                    conn.Open();

                    // prepare query command
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.Transaction = conn.BeginTransaction();
                        cmd.CommandText = "INSERT INTO productTable(`name`, `desc`, price, category, keywords, image_content, quantity) " +
                                "VALUES (@name, @desc, @price, @category, @keywords, @image_content, @quantity);";

                        var param = new MySqlParameter[]
                        {
                            new MySqlParameter { ParameterName="@name", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.name) ? "" : product.name },
                            new MySqlParameter { ParameterName="@desc", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.desc) ? "" : product.desc },
                            new MySqlParameter { ParameterName="@price", MySqlDbType = MySqlDbType.Int32, Value = product.price },
                            new MySqlParameter { ParameterName="@category", MySqlDbType = MySqlDbType.String, Value = product.category},
                            new MySqlParameter { ParameterName="@keywords", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.keywords) ? "" : product.keywords },
                            new MySqlParameter { ParameterName="@image_content", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.image_content) ? "" : product.image_content },
                            new MySqlParameter { ParameterName="@quantity", MySqlDbType = MySqlDbType.Int32, Value = product.quantity }
                        };

                        cmd.Parameters.AddRange(param);

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

                return true;
            }
            catch
            {
                throw;
            }


        }

        public static List<Product> GetProduct(string conString, string? search, string? sort, string? all, string? dog, string? cat, string? bird, string? hamster, int min = 0, int max = 0, int page = 1, int offset = 0)
        {
            try
            {
                var result = new List<Product>();
                var query = "SELECT * FROM productTable WHERE quantity > 0";
                using (var conn = new MySqlConnection(conString))
                {
                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        if (!String.IsNullOrEmpty(search) || min > 0 || max > 0 || !String.IsNullOrEmpty(all) || !String.IsNullOrEmpty(bird) || !String.IsNullOrEmpty(cat) || !String.IsNullOrEmpty(dog) || !String.IsNullOrEmpty(hamster))
                        {
                            
                           
                           
                            if (!String.IsNullOrEmpty(search))
                            {
                                var newSearch = "";
                                newSearch = Regex.Replace(search, @"\s+", " "); 
                                newSearch = Regex.Replace(search, "[^A-Za-z0-9 ]", "");
                                newSearch = newSearch.Trim();
                                newSearch = newSearch.Replace(" ", "|"); 

                                query += " AND (`name` REGEXP @search OR `keywords` REGEXP @search)";
                                cmd.Parameters.Add(new MySqlParameter { ParameterName = "@search", MySqlDbType = MySqlDbType.String, Value = newSearch });
                            }

                            if (min > 0 && max > 0)
                            {   
                                
                                query += " AND (price >= @min AND price <= @max)";
                                cmd.Parameters.AddRange(new MySqlParameter[] {
                                    new MySqlParameter { ParameterName = "@min", MySqlDbType = MySqlDbType.Int32, Value = min },
                                    new MySqlParameter { ParameterName = "@max", MySqlDbType = MySqlDbType.Int32, Value = max }
                                });
                            }
                            else if (min > 0 && max == 0)
                            {
                                
                                query += " AND price >= @min";
                                cmd.Parameters.Add(new MySqlParameter { ParameterName = "@min", MySqlDbType = MySqlDbType.Int32, Value = min });
                            }
                            else if (max > 0 && min == 0)
                            {
                               
                                query += " AND price <= @max";
                                cmd.Parameters.Add(new MySqlParameter { ParameterName = "@max", MySqlDbType = MySqlDbType.Int32, Value = max });
                            }

                            if (all == "all")
                            {

                                query += " AND (category = @cat OR category = @dog OR category = @bird OR category = @hamster)";
                                cmd.Parameters.AddRange(new MySqlParameter[]
                                {
                                    new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = "cat" },
                                    new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = "dog" },
                                    new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = "bird" },
                                    new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = "hamster" }
                                });


                            }
                            else if (all != "all")
                            {
                                if (cat == "cat" && dog == "dog" && bird == "bird" && hamster == "hamster")
                                {
                                   
                                    query += " AND (category = @cat OR category = @dog OR category = @bird OR category = @hamster)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                    new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                    new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },
                                    new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird },
                                    new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster }
                                    });
                                }
                                else if (cat != "cat" && dog != "dog" && bird != "bird" && hamster != "hamster")
                                {
                                  
                                    query += " AND (category = @cat OR category = @dog OR category = @bird OR category = @hamster)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                    new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = "cat" },
                                    new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = "dog" },
                                    new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = "bird" },
                                    new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = "hamster" }
                                    });
                                }

                                else if (cat == "cat" && dog == "dog" && bird == "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND (category = @cat OR category = @dog OR category = @bird)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },
                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird }
                                    });
                                    
                                }
                                else if (cat == "cat" && dog == "dog" && bird != "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND (category = @cat OR category = @dog OR category = @hamster)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },
                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster }
                                    });

                                }
                                else if (cat == "cat" && dog != "dog" && bird == "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND (category = @cat OR category = @hamster OR category = @bird)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster },
                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird }
                                    });

                                }
                                else if (cat != "cat" && dog == "dog" && bird == "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND (category = @hamster OR category = @dog OR category = @bird)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster },
                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },
                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird }
                                    });

                                }
                                else if (cat == "cat" && dog == "dog" && bird != "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND (category = @cat OR category = @dog)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },
                                     
                                    });

                                }
                                else if (cat == "cat" && dog != "dog" && bird == "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND (category = @cat OR category = @bird)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird },

                                    });

                                }
                                else if (cat == "cat" && dog != "dog" && bird != "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND (category = @cat OR category = @hamster)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat },
                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster },

                                    });

                                }
                                else if (cat != "cat" && dog == "dog" && bird == "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND (category = @bird OR category = @dog)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird },
                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },

                                    });

                                }
                                else if (cat != "cat" && dog == "dog" && bird != "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND (category = @hamster OR category = @dog)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster },
                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog },

                                    });

                                }
                                else if (cat != "cat" && dog != "dog" && bird == "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND (category = @bird OR category = @hamster)";
                                    cmd.Parameters.AddRange(new MySqlParameter[]
                                    {
                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird },
                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster },

                                    });

                                }
                                else if (cat == "cat" && dog != "dog" && bird != "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND category = @cat";
                                    cmd.Parameters.Add(
                                    
                                        new MySqlParameter { ParameterName = "@cat", MySqlDbType = MySqlDbType.String, Value = cat }

                                    );

                                }
                                else if (cat != "cat" && dog == "dog" && bird != "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND category = @dog";
                                    cmd.Parameters.Add(

                                        new MySqlParameter { ParameterName = "@dog", MySqlDbType = MySqlDbType.String, Value = dog }

                                    );

                                }
                                else if (cat != "cat" && dog != "dog" && bird == "bird" && hamster != "hamster")
                                {
                                    
                                    query += " AND category = @bird";
                                    cmd.Parameters.Add(

                                        new MySqlParameter { ParameterName = "@bird", MySqlDbType = MySqlDbType.String, Value = bird }

                                    );

                                }
                                else if (cat != "cat" && dog != "dog" && bird != "bird" && hamster == "hamster")
                                {
                                    
                                    query += " AND category = @hamster";
                                    cmd.Parameters.Add(

                                        new MySqlParameter { ParameterName = "@hamster", MySqlDbType = MySqlDbType.String, Value = hamster }

                                    );

                                }

                            }
                          
                        }
                        
                        if (!String.IsNullOrEmpty(sort))
                        {
                            if (sort == "new")
                            {
                                query += " ORDER BY product_id DESC";
                            }
                            else if (sort == "old")
                            {
                                query += " ORDER BY product_id ASC";
                            }
                            else if (sort == "high")
                            {
                                query += " ORDER BY price DESC";
                            }
                            else if (sort == "low")
                            {
                                query += " ORDER BY price ASC";
                            }
                            else if (sort == "popular")
                            {
                                query += " ORDER BY soldcount DESC";
                            }
                        }

                        var data = 9;
                        if (offset > 0)
                        {
                            query += $" LIMIT {offset * data} OFFSET {(offset - 1) * data}";
                        }
                        else if (offset == 0)
                        {
                            query += $" LIMIT {data * page}";
                        }
                        

                        cmd.CommandText = query;
                        cmd.Connection = conn;

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
                    conn.Close();

                }

                return result;
            }
            catch
            {
                throw;
            }
            
        }

        public static bool deleteProduct(string conString, ProductPost product)
        {
            try
            {
                using (var conn = new MySqlConnection(conString))
                {
                    conn.Open();

                    // prepare query command
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.Transaction = conn.BeginTransaction();
                        cmd.CommandText = "DELETE FROM productTable " +
                                "WHERE product_id = @product_id;";

                        cmd.Parameters.Add(new MySqlParameter { ParameterName = "@product_id", MySqlDbType = MySqlDbType.Int32, Value = product.product_id });

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
                return true;
            }
            catch
            {
                throw;
            }
        }

        public static bool editProduct(string conString, ProductPost product)
        {
            try
            {
                if (product.image_content != "")
                {
                    using (var conn = new MySqlConnection(conString))
                    {
                        conn.Open();

                        // prepare query command
                        using (var cmd = new MySqlCommand())
                        {
                            cmd.Connection = conn;
                            cmd.Transaction = conn.BeginTransaction();
                            cmd.CommandText = "UPDATE productTable " + "SET `name` = @name, `desc` = @desc, category = @category, keywords = @keywords, price = @price, quantity = @quantity, image_content = @image_content " +
                                    "WHERE product_id = @product_id;";

                            var param = new MySqlParameter[]
                            {
                            new MySqlParameter { ParameterName = "@product_id", MySqlDbType = MySqlDbType.Int32, Value = product.product_id },
                            new MySqlParameter { ParameterName="@name", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.name) ? "" : product.name },
                            new MySqlParameter { ParameterName="@desc", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.desc) ? "" : product.desc },
                            new MySqlParameter { ParameterName="@price", MySqlDbType = MySqlDbType.Int32, Value = product.price },
                            new MySqlParameter { ParameterName="@category", MySqlDbType = MySqlDbType.String, Value = product.category},
                            new MySqlParameter { ParameterName="@keywords", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.keywords) ? "" : product.keywords },
                            new MySqlParameter { ParameterName="@image_content", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.image_content) ? "" : product.image_content },
                            new MySqlParameter { ParameterName="@quantity", MySqlDbType = MySqlDbType.Int32, Value = product.quantity }
                            };

                            cmd.Parameters.AddRange(param);

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
                }
                else
                {
                    using (var conn = new MySqlConnection(conString))
                    {
                        conn.Open();

                        // prepare query command
                        using (var cmd = new MySqlCommand())
                        {
                            cmd.Connection = conn;
                            cmd.Transaction = conn.BeginTransaction();
                            cmd.CommandText = "UPDATE productTable " + "SET `name` = @name, `desc` = @desc, category = @category, keywords = @keywords, price = @price, quantity = @quantity " +
                                    "WHERE product_id = @product_id;";

                            var param = new MySqlParameter[]
                            {
                            new MySqlParameter { ParameterName = "@product_id", MySqlDbType = MySqlDbType.Int32, Value = product.product_id },
                            new MySqlParameter { ParameterName="@name", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.name) ? "" : product.name },
                            new MySqlParameter { ParameterName="@desc", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.desc) ? "" : product.desc },
                            new MySqlParameter { ParameterName="@price", MySqlDbType = MySqlDbType.Int32, Value = product.price },
                            new MySqlParameter { ParameterName="@category", MySqlDbType = MySqlDbType.String, Value = product.category},
                            new MySqlParameter { ParameterName="@keywords", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(product.keywords) ? "" : product.keywords },
                            new MySqlParameter { ParameterName="@quantity", MySqlDbType = MySqlDbType.Int32, Value = product.quantity }
                            };

                            cmd.Parameters.AddRange(param);

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
                }
                
                return true;
            }
            catch
            {
                throw;
            }
        }


        public static bool postProductCart(string conString, OrderBody body)
        {
            try
            {
                // prepare connection
                using (var conn = new MySqlConnection(conString))
                {
                    conn.Open();

                    // prepare query command
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText = "SELECT * FROM cart WHERE fk_product_id = @fk_product_id AND fk_user_id = @fk_user_id AND `order` = @order";
                        cmd.Parameters.AddRange(new MySqlParameter[]
                        {
                            new MySqlParameter { ParameterName="@fk_product_id", MySqlDbType = MySqlDbType.Int32, Value = body.fk_product_id },
                            new MySqlParameter { ParameterName="@fk_user_id", MySqlDbType = MySqlDbType.Int32, Value = body.fk_user_id },
                            new MySqlParameter { ParameterName="@order", MySqlDbType = MySqlDbType.Int32, Value = body.order }
                        });

                        MySqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            throw new Exception("Product Already in Your Cart");
                        }
                        reader.Close();
                    }

                    conn.Close();

                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.Transaction = conn.BeginTransaction();
                        cmd.CommandText = "INSERT INTO cart(fk_product_id, quantity_cart, fk_user_id, `order`, no_invoice) " +
                                "VALUES (@fk_product_id, @quantity, @fk_user_id, @order, @no_invoice);";

                        var param = new MySqlParameter[]
                        {
                            new MySqlParameter { ParameterName="@fk_product_id", MySqlDbType = MySqlDbType.Int32, Value = body.fk_product_id },
                            new MySqlParameter { ParameterName="@quantity", MySqlDbType = MySqlDbType.Int32, Value = body.quantity },
                            new MySqlParameter { ParameterName="@fk_user_id", MySqlDbType = MySqlDbType.Int32, Value = body.fk_user_id },
                            new MySqlParameter { ParameterName="@order", MySqlDbType = MySqlDbType.Int32, Value = body.order },
                            new MySqlParameter { ParameterName="@no_invoice", MySqlDbType = MySqlDbType.String, Value = String.IsNullOrEmpty(body.no_invoice) ? "" : body.no_invoice }
                        };

                        cmd.Parameters.AddRange(param);

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

                return true;
            }
            catch
            {
                throw;
            }
        }

        public static List<CartBody> GetCart(string conString, int user_id, int order)
        {
            try
            {
                var result = new List<CartBody>();
                using (var con = new MySqlConnection(conString))
                {
                    con.Open();

                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandText = "Select * from cart as c join producttable as pt where c.fk_product_id = pt.product_id AND c.fk_user_id = @fk_user_id AND c.`order` = @order";
                        cmd.Parameters.AddRange(new MySqlParameter[]
                        {
                            new MySqlParameter { ParameterName="@fk_user_id", MySqlDbType = MySqlDbType.Int32, Value = user_id },
                            new MySqlParameter { ParameterName="@order", MySqlDbType = MySqlDbType.Int32, Value = order }
                        });

                        MySqlDataReader reader = cmd.ExecuteReader();
                        if (reader.HasRows)
                        {
                            var count = 1;
                            while(reader.Read())
                            {
                                var temptresult = new CartBody();
                                temptresult.no = count;
                                temptresult.product_id = (int)reader["product_id"];
                                temptresult.price = (int)reader["price"];
                                temptresult.quantityproduct = (int)reader["quantity"];
                                temptresult.category = (string)reader["category"];
                                temptresult.name = (string)reader["name"];
                                temptresult.image_content = (string)reader["image_content"];
                                temptresult.quantity = (int)reader["quantity_cart"];
                                temptresult.fk_user_id = (int)reader["fk_user_id"];
                                temptresult.order = (int)reader["order"];
                                temptresult.no_invoice = (string)reader["no_invoice"];

                                result.Add(temptresult);
                                count++;
                            }
                        }

                        reader.Close();
                    }

                    con.Close();
                }

                return result;
            }
            catch
            {
                throw;
            }
            


        }

        public static bool UpdateProductCart(string conString, OrderBody body)
        {
            try
            {
                // prepare connection
                using (var conn = new MySqlConnection(conString))
                { 
                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.Transaction = conn.BeginTransaction();
                        cmd.CommandText = "update cart set quantity_cart = @quantity where fk_user_id = @fk_user_id AND `order` = @order AND fk_product_id = @fk_product_id";

                        var param = new MySqlParameter[]
                        {
                            new MySqlParameter { ParameterName="@fk_product_id", MySqlDbType = MySqlDbType.Int32, Value = body.fk_product_id },
                            new MySqlParameter { ParameterName="@quantity", MySqlDbType = MySqlDbType.Int32, Value = body.quantity },
                            new MySqlParameter { ParameterName="@fk_user_id", MySqlDbType = MySqlDbType.Int32, Value = body.fk_user_id },
                            new MySqlParameter { ParameterName="@order", MySqlDbType = MySqlDbType.Int32, Value = body.order }
                        };
                        cmd.Parameters.AddRange(param);

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

                return true;
            }
            catch
            {
                throw;
            }
        }


        

    }
}
