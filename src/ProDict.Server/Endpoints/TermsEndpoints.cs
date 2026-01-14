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
                    .Where(t => t.Name.Contains(search, StringComparison.OrdinalIgnoreCase))
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
            Term term = new()
            {
                Name = dto.Name,
                GroupId = dto.GroupId,
                Description = dto.Description,
                ReferenceLinks = dto.ReferenceLinks
            };
            db.Terms.Add(term);
            await db.SaveChangesAsync();
            CreateTermsDto termDto = new(
                term.Id,
                term.Name,
                term.GroupId,
                term.Description,
                term.ReferenceLinks
            );
            return Results.CreatedAtRoute(GetTermsEndpoint, new { id = term.Id }, term);
        });

        // PUT Endpoints
        // UPDATE Terms
        group.MapPut("/{id}", async (int id) =>
        {
            return Results.Ok();
        });

        // DELETE Endpoints
        // DELETE Terms
        group.MapDelete("/{id}", async (int id) =>
        {
            return Results.Ok();
        });
    }
}
