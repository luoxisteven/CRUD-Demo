using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;
using TaskManager.Api.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Get the database type from configuration
// AddSingleton: Creates a single instance of the service for the entire application lifetime
builder.Services.AddSingleton<IMongoClient>(new MongoClient("mongodb://localhost:27017"));
// AddScoped: Creates a new instance of the service for each HTTP request
builder.Services.AddScoped<TaskService>();

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Redirect Http to https (optional)
app.UseHttpsRedirection();

// Cors
app.UseCors();

app.MapControllers();

app.Run();