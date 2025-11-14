using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using MySqlConnector;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace ServerlessCrud
{
    public class Create
    {
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request?.Body))
                {
                    return JsonResponse(400, new { message = "Request body is required." });
                }

                var input = JsonSerializer.Deserialize<CreateTaskDto>(request.Body, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (input == null || string.IsNullOrWhiteSpace(input.Title))
                {
                    return JsonResponse(400, new { message = "Title is required." });
                }

                await using var connection = CreateConnectionFromEnv();
                await connection.OpenAsync();

                const string sql = @"INSERT INTO Tasks (Title, Description, Status)
                                     VALUES (@title, @description, @status);
                                     SELECT LAST_INSERT_ID();";

                await using var cmd = new MySqlCommand(sql, connection);
                cmd.Parameters.AddWithValue("@title", input.Title);
                cmd.Parameters.AddWithValue("@description", input.Description ?? string.Empty);
                cmd.Parameters.AddWithValue("@status", string.IsNullOrWhiteSpace(input.Status) ? "To Do" : input.Status);

                var idObj = await cmd.ExecuteScalarAsync();
                var id = Convert.ToInt32(idObj);

                var created = new TaskEntity
                {
                    Id = id,
                    Title = input.Title,
                    Description = input.Description ?? string.Empty,
                    Status = string.IsNullOrWhiteSpace(input.Status) ? "To Do" : input.Status
                };

                return JsonResponse(201, created);
            }
            catch (Exception ex)
            {
                context.Logger.LogError(ex.ToString());
                return JsonResponse(500, new { message = "Internal Server Error" });
            }
        }

        private static MySqlConnection CreateConnectionFromEnv()
        {
            var host = Environment.GetEnvironmentVariable("DB_HOST");
            var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "3306";
            var user = Environment.GetEnvironmentVariable("DB_USER");
            var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
            var database = Environment.GetEnvironmentVariable("DB_NAME");

            var cs = $"Server={host};Port={port};Database={database};User ID={user};Password={password};SslMode=Preferred;";
            return new MySqlConnection(cs);
        }

        private static APIGatewayProxyResponse JsonResponse(int statusCode, object payload)
        {
            return new APIGatewayProxyResponse
            {
                StatusCode = statusCode,
                Body = JsonSerializer.Serialize(payload),
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" },
                    { "Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS" },
                    { "Access-Control-Allow-Headers", "Content-Type,Authorization" }
                }
            };
        }
    }

    internal class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Status { get; set; }
    }

    internal class TaskEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "To Do";
    }
}


