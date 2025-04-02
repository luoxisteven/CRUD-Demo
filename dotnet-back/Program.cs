using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 所有集成ControllerBase的都会add
// e.g. public class TasksController : ControllerBase
builder.Services.AddControllers();

// Add database context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TaskContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add task service
// 意味着在同一个 HTTP 请求中会使用同一个 TaskService 实例。
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{   
    // Create database if it doesn't exist
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<TaskContext>();
        context.Database.EnsureCreated();
    }
}

// Redirect Http to https
app.UseHttpsRedirection();

// Cors
app.UseCors();

// app.UseAuthorization();

app.MapControllers();

app.Run();