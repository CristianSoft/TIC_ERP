namespace backendfepon.DTOs.EventExpenseDTO
{
    public class EventExpenseDTO
    {
        public int Expense_Id { get; set; }
        public int Transaction_Id { get; set; }
        public string Event_Name { get; set; }
        public List<string> Provider_Names { get; set; }
        public string Responsible_Name { get; set; }
    }
}
