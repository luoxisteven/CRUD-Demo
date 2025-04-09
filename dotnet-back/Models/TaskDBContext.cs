using Microsoft.EntityFrameworkCore;

namespace TaskManager.Api.Models
{
    public class TaskDBContext : DbContext
    {
        public TaskDBContext(DbContextOptions<TaskDBContext> options) : base(options)
        {
        }

        public DbSet<Task> Tasks { get; set; } = null!;
    }
}