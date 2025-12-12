using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartLoan.Data.Models
{
    public class Loan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrincipalAmount { get; set; }

        [Required]
        public int LoanTermMonths { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public LoanStatus Status { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? EMIAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalRepayment { get; set; }

        public DateTime? ApprovedDate { get; set; }
        public int? ApprovedByAdminId { get; set; }

        public string? RejectionReason { get; set; }
        public DateTime? RejectedDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<LoanPayment>? Payments { get; set; }
    }

    public enum LoanStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3,
        Active = 4,
        Paid = 5,
        Defaulted = 6
    }
}