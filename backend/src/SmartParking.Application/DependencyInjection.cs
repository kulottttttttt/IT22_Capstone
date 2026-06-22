using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SmartParking.Application.Common.Behaviors;
using System.Reflection;

namespace SmartParking.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // Register MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));

        // Register FluentValidation validators
        services.AddValidatorsFromAssembly(assembly);

        // Register pipeline behaviors
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        return services;
    }
}
