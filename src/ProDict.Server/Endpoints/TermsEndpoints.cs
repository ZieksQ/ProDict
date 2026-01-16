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
            var groupExist = await db.Groups.AnyAsync(g => g.Id == dto.GroupId);

            if (!groupExist) return Results.NotFound(
                new
                {
                    error = "GroupNotFound",
                    message = $"Group with ID {dto.GroupId} does not exist.",
                    ok = false
                }
            );
            Term term = new()
            {
                Name = dto.Name,
                GroupId = dto.GroupId,
                Description = dto.Description,
                ReferenceLinks = dto.ReferenceLinks
            };
            db.Terms.Add(term);
            await db.SaveChangesAsync();
            var savedTerm = await db.Terms
                               .Include(t => t.Group)
                               .AsNoTracking()
                               .FirstOrDefaultAsync(g => g.Id == term.Id);
            TermsSummaryDto termDto = new(
                savedTerm!.Id,
                savedTerm.Name,
                savedTerm.Group!.Name,
                savedTerm.GroupId,
                savedTerm.Description,
                savedTerm.ReferenceLinks
            );
            return Results.CreatedAtRoute(GetTermsEndpoint, new { id = termDto.Id }, termDto);
        });

        // PUT Endpoints
        // UPDATE Terms
        group.MapPut("/{id}", async (int id, CreateTermsDto dto, AppDbContext db) =>
        {
            var groupExist = await db.Groups.AnyAsync(g => g.Id == dto.GroupId);

            if (!groupExist) return Results.NotFound(
                new
                {
                    error = "GroupNotFound",
                    message = $"Group with ID {dto.GroupId} does not exist.",
                    ok = false
                }
            );

            var term = await db.Terms.FindAsync(id);

            if (term is null) return Results.NotFound();

            term.Name = dto.Name;
            term.GroupId = dto.GroupId;
            term.Description = dto.Description;
            term.ReferenceLinks = dto.ReferenceLinks;

            await db.SaveChangesAsync();
            var savedTerms = await db.Terms
                               .Include(t => t.Group)
                               .AsNoTracking()
                               .FirstOrDefaultAsync(g => g.GroupId == term.GroupId);
            TermsDetailsDto newDto = new(
                savedTerms!.Id,
                savedTerms.Name,
                savedTerms.Group!.Name,
                savedTerms.Description,
                savedTerms.ReferenceLinks
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
