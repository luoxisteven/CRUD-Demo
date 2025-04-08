using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskService
    {
        private readonly TaskContext _context;

        public TaskService(TaskContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Models.Task>> GetAllTasksAsync()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<Models.Task?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<Models.Task> CreateTaskAsync(CreateTaskDto taskDto)
        {
            var task = new Models.Task
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = taskDto.Status,
                // CreatedAt = DateTime.UtcNow,
                // UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<Models.Task?> UpdateTaskAsync(int id, UpdateTaskDto taskDto)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
            {
                return null;
            }

            // Update only properties that are not null
            if (taskDto.Title != null)
            {
                task.Title = taskDto.Title;
            }

            if (taskDto.Description != null)
            {
                task.Description = taskDto.Description;
            }

            if (taskDto.Status != null)
            {
                task.Status = taskDto.Status;
            }

            // task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
            {
                return false;
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}