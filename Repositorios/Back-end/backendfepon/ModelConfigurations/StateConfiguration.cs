using backendfepon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backendfepon.ModelConfigurations
{
    public class StateConfiguration : IEntityTypeConfiguration<State>
    {
        public void Configure(EntityTypeBuilder<State> modelBuilder)
        {
            modelBuilder.ToTable("STATE");
            modelBuilder.HasKey(p => p.State_Id);
        }
    }
}
