using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Api.Models
{
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