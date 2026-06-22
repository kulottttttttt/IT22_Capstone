namespace SmartParking.Application.Common.Interfaces;

/// <summary>
/// Service for analyzing historical parking data.
/// </summary>
public interface IAnalyticsService
{
    /// <summary>
    /// Calculates the historical average occupancy percentage for a zone.
    /// </summary>
    Task<decimal> GetHistoricalAverageOccupancyAsync(Guid zoneId, int lookbackDays = 30, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates the peak hour occupancy percentage for a zone.
    /// </summary>
    Task<decimal> GetPeakHourOccupancyAsync(Guid zoneId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the average occupancy for a zone at a specific hour of the day.
    /// </summary>
    Task<decimal> GetAverageOccupancyByHourAsync(Guid zoneId, int hourOfDay, int lookbackDays = 30, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the average occupancy for a zone on a specific day of the week.
    /// </summary>
    Task<decimal> GetAverageOccupancyByDayOfWeekAsync(Guid zoneId, DayOfWeek dayOfWeek, int lookbackWeeks = 4, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates the recent trend (last 24 hours) for a zone.
    /// Returns positive for increasing occupancy, negative for decreasing.
    /// </summary>
    Task<decimal> GetRecentTrendAsync(Guid zoneId, CancellationToken cancellationToken = default);
}
