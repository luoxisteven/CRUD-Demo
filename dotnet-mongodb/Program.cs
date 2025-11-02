using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;
using TaskManager.Api.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Mongo connection (prefer env var, then config, else service name in Docker)
var mongoConnectionString = Environment.GetEnvironmentVariable("MONGO_URL")
    ?? builder.Configuration["MONGO_URL"]
    ?? "mongodb://mongodb:27017";
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConnectionString));
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