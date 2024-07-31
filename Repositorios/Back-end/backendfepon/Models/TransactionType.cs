namespace backendfepon.Models
{
    public class TransactionType
    {
        public int Transaction_Type_Id { get; set; }
        public string Transaction_Type_Name { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
    }
}
