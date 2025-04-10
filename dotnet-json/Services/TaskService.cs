using System.Text.Json;
using Microsoft.Extensions.Configuration;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskService
    {
        private readonly string _filePath;

        public TaskService(IConfiguration configuration)
        {
            _filePath = configuration.GetValue<string>("TaskFilePath") ?? "data/tasks.json";

            if (!File.Exists(_filePath))
            {
                // Ensure _filePath is valid before writing to the file
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath) ?? string.Empty);
                File.WriteAllText(_filePath, "[]");
            }
        }


        public async Task<IEnumerable<TaskEntity>> GetAllTasksAsync()
        {
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<TaskEntity>>(json) ?? new List<TaskEntity>(); // Ensure non-null return
        }

        public async Task<TaskEntity?> GetTaskByIdAsync(int id)
        {
            var tasks = await GetAllTasksAsync();
            return tasks.FirstOrDefault(t => t.Id == id);
        }

        public async Task<TaskEntity> CreateTaskAsync(CreateTaskDto taskDto)
        {
            var tasks = (await GetAllTasksAsync()).ToList();
            var newTask = new TaskEntity
            {
                Id = tasks.Any() ? tasks.Max(t => t.Id) + 1 : 1, // Generate a new ID
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = taskDto.Status
            };

            tasks.Add(newTask);
            await SaveTasksAsync(tasks);

            return newTask;
        }

        public async Task<TaskEntity?> UpdateTaskAsync(int id, UpdateTaskDto taskDto)
        {
            var tasks = (await GetAllTasksAsync()).ToList();
            var task = tasks.FirstOrDefault(t => t.Id == id);

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

            await SaveTasksAsync(tasks);

            return task;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var tasks = (await GetAllTasksAsync()).ToList();
            var task = tasks.FirstOrDefault(t => t.Id == id);

            if (task == null)
            {
                return false;
            }

            tasks.Remove(task);
            await SaveTasksAsync(tasks);

            return true;
        }

        private async Task SaveTasksAsync(IEnumerable<TaskEntity> tasks)
        {
            var json = JsonSerializer.Serialize(tasks, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}