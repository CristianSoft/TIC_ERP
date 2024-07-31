using backendfepon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backendfepon.ModelConfigurations
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> modelBuilder)
        {
            modelBuilder.ToTable("STUDENT");
            modelBuilder.HasKey(p => p.Student_Id);
            /*

            // Relationships
            modelBuilder.HasOne(e => e.AdministrativeMember)
                .WithOne(c => c.Student)
                .HasForeignKey<AdministrativeMember>(e => e.Student_Id);

            modelBuilder
               .HasOne(p => p.Faculty)
               .WithMany(s => s.Students)
               .HasForeignKey(p => p.Faculty_Id);

            modelBuilder
              .HasOne(p => p.Career)
              .WithMany(s => s.Students)
              .HasForeignKey(p => p.Career_Id);

            modelBuilder
            .HasOne(p => p.Semester)
            .WithMany(s => s.Students)
            .HasForeignKey(p => p.Semester_Id);

            */
        }
    }
}
