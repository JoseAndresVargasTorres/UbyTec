using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class TipoComercioContext : DbContext
{
    public DbSet<TipoComercioItem> TipoComercios { get; set; } = null!;

    public TipoComercioContext(DbContextOptions<TipoComercioContext> options)
        : base(options)
    {}
}
