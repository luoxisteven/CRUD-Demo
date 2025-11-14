using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using MySqlConnector;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace ServerlessCrud
{
    public class Get
    {
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                var id = ResolveId(request);
                if (id == null)
                {
                    return JsonResponse(400, new { message = "Missing or invalid 'id' parameter." });
                }

                await using var connection = CreateConnectionFromEnv();
                await connection.OpenAsync();

                const string sql = @"SELECT Id, Title, Description, Status FROM Tasks WHERE Id = @id;";
                await using var cmd = new MySqlCommand(sql, connection);
                cmd.Parameters.AddWithValue("@id", id.Value);

                await using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var task = new TaskEntity
                    {
                        Id = reader.GetInt32(0),
                        Title = reader.GetString(1),
                        Description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                        Status = reader.GetString(3)
                    };

                    return JsonResponse(200, task);
                }

                return JsonResponse(404, new { message = "Not found." });
            }
            catch (Exception ex)
            {
                context.Logger.LogError(ex.ToString());
                return JsonResponse(500, new { message = "Internal Server Error" });
            }
        }

        private static int? ResolveId(APIGatewayProxyRequest request)
        {
            if (request?.PathParameters != null && request.PathParameters.TryGetValue("id", out var idStr) && int.TryParse(idStr, out var idPath))
            {
                return idPath;
            }

            if (request?.QueryStringParameters != null && request.QueryStringParameters.TryGetValue("id", out var idQ) && int.TryParse(idQ, out var idQuery))
            {
                return idQuery;
            }

            return null;
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


