using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ProDict.Server.Data;
using ProDict.Server.Dtos;
using ProDict.Server.Models;

namespace ProDict.Server.Endpoints;

public static class TermsEndpoints
{
    const string GetTermsEndpoint = "GetTermsById";
    public static void MapTermsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/terms");

        // GET Endpoints
        // GET All Terms
        group.MapGet("/", async (string? search, AppDbContext db) =>
        {
            if (search is null)
            {
                var terms = await db.Terms
                              .Include(g => g.Group)
                              .Select(t => new TermsDetailsDto(
                                    t.Id,
                                    t.Name,
                                    t.Group!.Name,
                                    t.Description,
                                    t.ReferenceLinks
                              ))
                              .AsNoTracking()
                              .ToListAsync();
                return Results.Ok(terms);
            }
            var searchTerms = await db.Terms
                    .Include(g => g.Group)
                    .Where(t => t.Name.Contains(search))
                    .Select(t => new TermsDetailsDto(
                            t.Id,
                            t.Name,
                            t.Group!.Name,
                            t.Description,
                            t.ReferenceLinks
                    ))
                    .AsNoTracking()
                    .ToListAsync();
            return Results.Ok(searchTerms);
        });

        // GET Specific Terms using Id
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var term = await db.Terms
                                .Include(g => g.Group)
                                .FirstOrDefaultAsync(t => t.Id == id);
            if (term is null) return Results.NotFound();
            TermsDetailsDto termsDetails = new(
                term.Id,
                term.Name,
                term.Group!.Name,
                term.Description,
                term.ReferenceLinks
            );
            return Results.Ok(termsDetails);
        }).WithName(GetTermsEndpoint);

        // POST Endpoints
        // CREATE New Terms
        group.MapPost("/", async (CreateTermsDto dto, AppDbContext db) =>
        {
            try
            {
                Term term = new()
                {
                    Name = dto.Name,
                    GroupId = dto.GroupId,
                    Description = dto.Description,
                    ReferenceLinks = dto.ReferenceLinks
                };

                db.Terms.Add(term);
                await db.SaveChangesAsync();

                var groupName = await db.Groups
                    .Where(g => g.Id == dto.GroupId)
                    .Select(g => g.Name)
                    .AsNoTracking()
                    .FirstAsync();

                return Results.CreatedAtRoute(
                    GetTermsEndpoint,
                    new { id = term.Id },
                    new TermsSummaryDto(
                        term.Id,
                        term.Name,
                        groupName,
                        term.GroupId,
                        term.Description,
                        term.ReferenceLinks
                    )
                );
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException!.Message.Contains("FOREIGN KEY constraint") == true)
                {
                    return Results.NotFound(new
                    {
                        error = "GroupNotFound",
                        message = "Group does not exists",
                        ok = false
                    });
                }
                throw;
            }
        });

        // PUT Endpoints
        // UPDATE Terms
        group.MapPut("/{id}", async (int id, CreateTermsDto dto, AppDbContext db) =>
        {
            var termWithGroup = await db.Terms
                // .Include(t => t.Group)
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    Term = t,
                    GroupName = t.Group!.Name,
                    GroupExists = db.Groups.Any(g => g.Id == dto.GroupId)
                })
                .FirstOrDefaultAsync();

            if (termWithGroup == null)
                return Results.NotFound();
            if (!termWithGroup.GroupExists)
                return Results.BadRequest();

            var term = termWithGroup.Term;
            term.Name = dto.Name;
            term.GroupId = dto.GroupId;
            term.Description = dto.Description;
            term.ReferenceLinks = dto.ReferenceLinks;

            await db.SaveChangesAsync();

            TermsDetailsDto newDto = new(
                term.Id,
                term.Name,
                termWithGroup.GroupName,
                term.Description,
                term.ReferenceLinks
            );

            return Results.Ok(newDto);
        });

        // DELETE Endpoints
        // DELETE Terms
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var termExists = await db.Terms.AnyAsync(t => t.Id == id);
            if (!termExists) return Results.NotFound(
                new
                {
                    error = "TermsNotFound",
                    message = "Terms does not exist.",
                    ok = false
                }
            );

            await db.Terms
                    .Where(t => t.Id == id)
                    .ExecuteDeleteAsync();
            return Results.NoContent();
        });
    }
}
