using System.ComponentModel.DataAnnotations;

namespace ProDict.Server.Dtos;

public record CreateGroupDto([Required][StringLength(64)] string Name);
