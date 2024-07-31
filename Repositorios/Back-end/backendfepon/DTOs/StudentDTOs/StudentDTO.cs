namespace backendfepon.DTOs.StudentDTOs
{
    public class StudentDTO
    {
        public int Student_Id { get; set; }
        public int Faculty_Id { get; set; }
        public int Career_Id { get; set; }
        public int Semester_Id { get; set; }
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public DateTime Birth_Date { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
