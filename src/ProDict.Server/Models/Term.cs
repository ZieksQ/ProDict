namespace ProDict.Server.Models;

public class Term
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public Group? Group { get; set; }
    public int GroupId { get; set; }
    public string? Description { get; set; }
    public string? ReferenceLinks { get; set; }
}
