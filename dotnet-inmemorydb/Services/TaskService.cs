using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskService
    {
        private readonly TaskDBContext _context;

        public TaskService(TaskDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskEntity>> GetAllTasksAsync()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<TaskEntity?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<TaskEntity> CreateTaskAsync(CreateTaskDto taskDto)
        {
            var task = new TaskEntity
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = taskDto.Status,
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<TaskEntity?> UpdateTaskAsync(int id, UpdateTaskDto taskDto)
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