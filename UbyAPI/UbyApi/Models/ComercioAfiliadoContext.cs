using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class ComercioAfiliadoContext : DbContext
{
    public DbSet<ComercioAfiliadoItem> ComeriosAfiliados { get; set; } = null!;

    public ComercioAfiliadoContext(DbContextOptions<ComercioAfiliadoContext> options)
        : base(options)
    {}
}