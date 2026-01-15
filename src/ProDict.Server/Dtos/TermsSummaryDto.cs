using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record TermsSummaryDto(
        int Id,
        string Name,
        string Group,
        int GroupId,
        string? Description,
        [Url] string? ReferenceLinks
);
