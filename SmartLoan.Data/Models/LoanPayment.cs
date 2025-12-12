using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartLoan.Data.Models
{
    public class LoanPayment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LoanId { get; set; }

        [ForeignKey("LoanId")]
        public virtual Loan? Loan { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        public int PaymentNumber { get; set; }

        public PaymentStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public enum PaymentStatus
    {
        Pending = 1,
        Paid = 2,
        Late = 3,
        Missed = 4
    }
}