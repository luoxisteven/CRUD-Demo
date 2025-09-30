# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore as distinct layers
COPY dotnet-back.csproj ./
RUN dotnet restore "dotnet-back.csproj"

# copy the rest of the source
COPY . .

# publish
RUN dotnet publish "dotnet-back.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Expose the port configured in launchSettings (http 3000)
EXPOSE 3000

ENV ASPNETCORE_URLS=http://0.0.0.0:3000 \
    ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "dotnet-back.dll"]


