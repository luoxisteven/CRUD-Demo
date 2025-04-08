using Microsoft.EntityFrameworkCore;

namespace TaskManager.Api.Models
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options) : base(options)
        {
        }

        public DbSet<Task> Tasks { get; set; } = null!;

        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     // Configure Task entity
        //     modelBuilder.Entity<Task>()
        //         .Property(t => t.CreatedAt)
        //         .HasDefaultValueSql("CURRENT_TIMESTAMP");

        //     modelBuilder.Entity<Task>()
        //         .Property(t => t.UpdatedAt)
        //         .HasDefaultValueSql("CURRENT_TIMESTAMP");
        // }
    }
}