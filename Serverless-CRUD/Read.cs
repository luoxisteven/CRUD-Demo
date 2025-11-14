using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using MySqlConnector;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace ServerlessCrud
{
    public class Read
    {
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                await using var connection = CreateConnectionFromEnv();
                await connection.OpenAsync();

                const string sql = @"SELECT Id, Title, Description, Status FROM Tasks ORDER BY Id DESC;";
                await using var cmd = new MySqlCommand(sql, connection);
                await using var reader = await cmd.ExecuteReaderAsync();

                var list = new List<TaskEntity>();
                while (await reader.ReadAsync())
                {
                    list.Add(new TaskEntity
                    {
                        Id = reader.GetInt32(0),
                        Title = reader.GetString(1),
                        Description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                        Status = reader.GetString(3)
                    });
                }

                return JsonResponse(200, list);
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

    internal class TaskEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "To Do";
    }
}


