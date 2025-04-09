using MongoDB.Driver;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskService
    {
        private readonly IMongoCollection<TaskEntity> _tasks;
        
        public TaskService(IMongoClient mongoClient) 
        {
            var database = mongoClient.GetDatabase("task_manager");
            _tasks = database.GetCollection<TaskEntity>("tasks");
        }

        public async Task<IEnumerable<TaskEntity>> GetAllTasksAsync()
        {
            return await _tasks.Find(_ => true).ToListAsync();
        }

        public async Task<TaskEntity?> GetTaskByIdAsync(string id)
        {
            return await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<TaskEntity> CreateTaskAsync(CreateTaskDto taskDto)
        {
            var task = new TaskEntity
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = taskDto.Status
            };
            
            await _tasks.InsertOneAsync(task);
            return task;
        }

        public async Task<TaskEntity?> UpdateTaskAsync(String id, UpdateTaskDto taskDto)
        {
            // First, find the task
            var task = await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();
            
            if (task == null)
            {
                return null;
            }

            // Build an update definition
            var updateDefinition = Builders<TaskEntity>.Update.Combine();
            
            if (taskDto.Title != null)
            {
                updateDefinition = updateDefinition.Set(t => t.Title, taskDto.Title);
            }
            
            if (taskDto.Description != null)
            {
                updateDefinition = updateDefinition.Set(t => t.Description, taskDto.Description);
            }
            
            if (taskDto.Status != null)
            {
                updateDefinition = updateDefinition.Set(t => t.Status, taskDto.Status);
            }
            
            // Apply the updates
            await _tasks.UpdateOneAsync(t => t.Id == id, updateDefinition);
            
            // Return the updated task
            return await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteTaskAsync(String id)
        {
            var result = await _tasks.DeleteOneAsync(t => t.Id == id);
            return result.DeletedCount > 0;
        }
    }
}