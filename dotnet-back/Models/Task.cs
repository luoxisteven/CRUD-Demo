using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Api.Models
{
    public class Task
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "To Do";

        // [Column(TypeName = "timestamp")]
        // public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // [Column(TypeName = "timestamp")]
        // public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CreateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "To Do";
    }

    public class UpdateTaskDto
    {
        public string? Title { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; }
    }
}