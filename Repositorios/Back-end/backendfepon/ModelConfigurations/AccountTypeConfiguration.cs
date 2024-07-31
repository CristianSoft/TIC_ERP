using backendfepon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backendfepon.ModelConfigurations
{
    public class AccountTypeConfiguration : IEntityTypeConfiguration<AccountType>
    {
        public void Configure(EntityTypeBuilder<AccountType> modelBuilder)
        {
            modelBuilder.ToTable("ACCOUNT_TYPE");
            modelBuilder.HasKey(p => p.Account_Type_Id);

        }
    }
}
