using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class DireccionClienteContext : DbContext
{
    public DbSet<DireccionClienteItem> DireccionAdministrador {get; set;} = null!;

    public DireccionClienteContext(DbContextOptions<DireccionClienteContext> options) 
        : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
