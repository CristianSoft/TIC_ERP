using backendfepon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backendfepon.ModelConfigurations
{
    public class InventoryMovementTypeConfiguration : IEntityTypeConfiguration<InventoryMovementType>
    {
        public void Configure(EntityTypeBuilder<InventoryMovementType> modelBuilder)
        {
            modelBuilder.ToTable("INVENTORY_MOVEMENT_TYPE");
            modelBuilder.HasKey(p => p.Movement_Type_Id);
        }
    }
}
