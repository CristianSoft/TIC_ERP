using backendfepon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backendfepon.ModelConfigurations
{
    public class TransactionTypeConfiguration : IEntityTypeConfiguration<TransactionType>
    {
        public void Configure(EntityTypeBuilder<TransactionType> modelBuilder)
        {
            modelBuilder.ToTable("TRANSACTION_TYPE");
            modelBuilder.HasKey(p => p.Transaction_Type_Id);
        }
    }
}
