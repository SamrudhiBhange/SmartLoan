using Microsoft.EntityFrameworkCore;
using SmartLoan.Data.Models;

namespace SmartLoan.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Loan> Loans => Set<Loan>();
        public DbSet<LoanPayment> LoanPayments => Set<LoanPayment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Loans)
                .WithOne(l => l.User)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Loan>()
                .HasMany(l => l.Payments)
                .WithOne(p => p.Loan)
                .HasForeignKey(p => p.LoanId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}