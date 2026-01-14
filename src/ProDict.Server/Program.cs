using ProDict.Server.Data;
using ProDict.Server.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.AddAppDb();

var app = builder.Build();

// Endpoints and Migrations
app.MapTermsEndpoints();
app.MigrateDb();

app.Run();
