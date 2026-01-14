using Microsoft.EntityFrameworkCore;

namespace ProDict.Server.Data;

public static class DataExtentions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider
                             .GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
    }

    public static void AddAppDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("DB");
        builder.Services.AddSqlite<AppDbContext>(connString);
    }
}
