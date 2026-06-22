using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Application.Common.Settings;
using SmartParking.Infrastructure.Persistence;
using SmartParking.Infrastructure.Services;

namespace SmartParking.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                connectionString,
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // JWT Settings
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        // Authentication Services
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();

        // Analytics and Prediction Services
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<IPredictionService, PredictionService>();

        // Note: ParkingHubService is registered in Presentation layer 
        // to avoid circular dependency with Hub types

        return services;
    }
}
