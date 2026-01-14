using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record TermsDto(
        [Required] int Id,
        [Required] string Name,
        int GroupId,
        string? Description,
        [Url] string? ReferenceLinks
);
