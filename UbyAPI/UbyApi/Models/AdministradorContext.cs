using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

public class AdministradorContext : DbContext
{

    public AdministradorContext(DbContextOptions<AdministradorContext> options)
        : base(options)
    {}

    public DbSet<AdministradorItem> Administradores { get; set; } = null!;

}
