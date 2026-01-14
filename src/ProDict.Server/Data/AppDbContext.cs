using Microsoft.EntityFrameworkCore;
using ProDict.Server.Models;

namespace ProDict.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Term> Terms => Set<Term>();
    public DbSet<Group> Groups => Set<Group>();
}
