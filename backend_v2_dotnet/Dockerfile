# docker build -t back-github-actions-v2 .
# docker run -d -p 5001:5001 back-github-actions-v2

# Stage 1: Base
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5001

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["./backend_v2.csproj", "."]
RUN dotnet restore "backend_v2.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet publish "backend_v2.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5001
ENV ASPNETCORE_ENVIRONMENT Production
ENTRYPOINT ["dotnet", "backend_v2.dll"]
