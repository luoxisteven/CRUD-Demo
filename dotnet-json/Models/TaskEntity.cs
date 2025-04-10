using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models
{
    public class TaskEntity
    {
        [Key]
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

}