using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models
{
    public class TaskEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] 
        public String? Id { get; set; }

        [Required]
        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [BsonElement("status")]
        public string Status { get; set; } = "To Do";

        [BsonElement("__v")] // Ignore the __v field
        public int Version { get; set; }

        // If you want to re-enable timestamps:
        // [BsonElement("createdAt")]
        // public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // [BsonElement("updatedAt")]
        // public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}