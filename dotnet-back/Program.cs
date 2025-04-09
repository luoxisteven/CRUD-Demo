using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// e.g. public class TasksController : ControllerBase
// e.g. public class TasksController : Controller
builder.Services.AddControllers();

// Add MySQL database context
var connectionString = builder.Configuration.GetConnectionString("MySQLConnection");
builder.Services.AddDbContext<TaskDBContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

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

// Create database if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<TaskDBContext>();
    context.Database.EnsureCreated();
}

// Redirect Http to https
app.UseHttpsRedirection();

// Cors
app.UseCors();

app.MapControllers();

app.Run();