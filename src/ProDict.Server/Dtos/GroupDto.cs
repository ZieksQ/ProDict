using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record GroupDto (
        [Required] int Id,
        [Required][StringLength(64)] string Name
);
