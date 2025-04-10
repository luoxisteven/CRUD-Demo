using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// e.g. public class TasksController : ControllerBase
// e.g. public class TasksController : Controller
builder.Services.AddControllers();

// Register task service
// This means that within the same HTTP request, the same TaskService instance will be used.
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
// app.UseHttpsRedirection();

// Cors
app.UseCors();

app.MapControllers();

app.Run();