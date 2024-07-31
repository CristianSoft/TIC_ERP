namespace backendfepon.Models
{
    public class Association
    {
        public int Association_Id { get; set; }
        public int State_Id { get; set; }
        public string Mission { get; set; }
        public string Vision { get; set; }

        public State State { get; set; }
    }
}
