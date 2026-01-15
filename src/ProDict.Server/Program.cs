using ProDict.Server.Data;
using ProDict.Server.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.AddAppDb();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Endpoints and Migrations
app.MapTermsEndpoints();
app.MapGroupsEndpoints();
app.MigrateDb();

app.Run();
