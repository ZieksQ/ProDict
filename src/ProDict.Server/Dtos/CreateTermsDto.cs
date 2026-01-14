using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record CreateTermsDto(
        [Required] int Id,
        [Required] string Name,
        int GroupId,
        [StringLength(500)] string? Description,
        [Url] string? ReferenceLinks
);
