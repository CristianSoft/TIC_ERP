namespace backendfepon.Models
{
    public class Category
    {
        public int Category_Id { get; set; }
        public string Description { get; set; }

        public ICollection<Product> Products { get; set; }


    }
}
