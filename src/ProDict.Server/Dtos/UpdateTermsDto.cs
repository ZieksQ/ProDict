using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record UpdateTermsDto(
        [Required] string Name,
        int GroupId,
        [StringLength(500, MinimumLength = 0)] string? Description,
        [Url] string? ReferenceLinks
);
