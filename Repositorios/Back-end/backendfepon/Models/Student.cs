namespace backendfepon.Models
{
    public class Student
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

        //Navigation

        public Contributor Contributor { get; set; }

        public AdministrativeMember AdministrativeMember { get; set; }

        public Career Career { get; set; }
        public Semester Semester { get; set; }

        public Faculty Faculty { get; set; }
    }
}
