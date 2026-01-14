using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record TermsDetailsDto(
        [Required] int Id,
        [Required] string Name,
        string? Group,
        string? Description,
        [Url] string? ReferenceLinks
);
