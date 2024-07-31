namespace backendfepon.Models
{
    public class EventIncome
    {
        public int Income_Id { get; set; }
        public int Transaction_Id { get; set; }
        public int Event_Id { get; set; }

        public Transaction Transaction { get; set; }
        public Event Event { get; set; }
    }
}
