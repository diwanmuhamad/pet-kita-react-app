namespace WebApi.Models
{
    public class OrderBody
    {
        public int fk_product_id { get; set; }
        public int quantity { get; set; }
        public int fk_user_id { get; set; }
        public int order { get; set; }
        public string no_invoice { get; set; }
        public string action { get; set; }
    }

    public class CartBody : OrderBody

    {
        public int no { get; set; }
        public int product_id { get; set; }
        public string name { get; set; }
        public string category { get; set; }
        public int price { get; set; }
        public int quantityproduct { get; set; }
        public string image_content { get; set; }


    }

    public class InvoiceBody
    {
        public int order_invoice { get; set; }
        public int fk_user_id { get; set; }
        public string no_invoice { get; set; }
        public string buy_date { get; set; }
        public int total_product { get; set; }
        public int total_price { get; set; }
        public string address { get; set; }
        public string number { get; set; }
        public string payment { get; set; }
    }

    public class InvoiceBodyAdmin : InvoiceBody
    {
        public int no { get; set; }
    }
    public class InvoiceDetailsBody
    {
        public int no { get; set; }
        public string name { get; set; }
        public string category { get; set; }
        public int quantity { get; set; }
        public int price { get; set; }
        public string no_invoice { get; set; }
        public int total_price { get; set; }
        public string buy_date { get; set; }
    }
}
