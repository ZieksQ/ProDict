using Microsoft.EntityFrameworkCore;
using ProDict.Server.Data;
using ProDict.Server.Dtos;
using ProDict.Server.Models;

namespace ProDict.Server.Endpoints;

public static class GroupsEndpoints
{
    const string GetGroupEndpoints = "GetGroup";
    public static void MapGroupsEndpoints(this WebApplication app)
    {
        var groupApp = app.MapGroup("/groups");

        // GET
        // Get All Groups
        groupApp.MapGet("/", async (AppDbContext db) =>
        {
            var group = await db.Groups
                            .Select(g => new GroupDto(
                                g.Id,
                                g.Name
                            ))
                            .AsNoTracking()
                            .ToListAsync();
            return Results.Ok(group);
        });

        groupApp.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var group = await db.Groups.FindAsync(id);

            if (group is null) return Results.NotFound();

            GroupDto newGroup = new(
                group.Id,
                group.Name
            );
            return Results.Ok(newGroup);
        }).WithName(GetGroupEndpoints);

        // POST
        // Create new Group
        groupApp.MapPost("/", async (CreateGroupDto dto, AppDbContext db) =>
        {
            Group group = new()
            {
                Name = dto.Name
            };
            db.Groups.Add(group);
            await db.SaveChangesAsync();
            GroupDto newDto = new(
                    group.Id,
                    group.Name
                    );
            return Results.CreatedAtRoute(GetGroupEndpoints, new { id = newDto.Id }, newDto);
        });

        groupApp.MapPut("/{id}", async (int id, CreateGroupDto dto, AppDbContext db) =>
        {
            var group = await db.Groups.FindAsync(id);
            if (group is null) return Results.NotFound();
            group.Name = dto.Name;
            await db.SaveChangesAsync();
            return Results.Ok(group);
        });

        groupApp.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var group = await db.Groups.FindAsync(id);
            if (group is null) return Results.NotFound();
            db.Groups.Remove(group);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
