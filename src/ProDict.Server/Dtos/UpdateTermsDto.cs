using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record UpdateTermsDto(
        [Required] string Name,
        int GroupId,
        [Range(0, 500)] string? Description,
        [Url] string? ReferenceLinks
);
