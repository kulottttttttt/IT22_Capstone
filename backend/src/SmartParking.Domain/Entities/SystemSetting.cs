using SmartParking.Domain.Common;

namespace SmartParking.Domain.Entities;

/// <summary>
/// Represents a system-wide configuration setting stored as a key-value pair.
/// </summary>
public class SystemSetting : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique key identifying this setting.
    /// </summary>
    public string SettingKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the value of the setting.
    /// </summary>
    public string SettingValue { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets an optional description of what this setting controls.
    /// </summary>
    public string? Description { get; set; }
}
