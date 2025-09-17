using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container. (A must)
// e.g. public class TasksController : ControllerBase
// e.g. public class TasksController : Controller
builder.Services.AddControllers();

// Add In-memory database context
builder.Services.AddDbContext<TaskDBContext>(options =>
    options.UseInMemoryDatabase("TaskDB"));

// Register task service
// This means that within the same HTTP request, the same TaskService instance will be used.
builder.Services.AddScoped<TaskService>();

// Add CORS support (A must if you use frontend to access the API)
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

// Create database if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<TaskDBContext>();
    context.Database.EnsureCreated();
}

// Redirect Http to https (optional)
// app.UseHttpsRedirection();

// These two has been automatically added by WebApplication.CreateBuilder(args)
// app.UseRouting();
// app.UseEndpoints();

// Cors (A must if you use frontend to access the API)
app.UseCors();

// MapControllers (A must)
app.MapControllers();

app.Run();