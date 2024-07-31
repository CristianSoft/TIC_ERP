namespace backendfepon.Models
{
    public class EventState
    {
        public int Event_State_Id { get; set; }
        public string Event_State_Name { get; set; }
        public ICollection<Event> Events { get; set; }
    }
}
