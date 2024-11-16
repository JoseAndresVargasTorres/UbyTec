using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

public class ProductosPedidosContext : DbContext
{
    public DbSet<ProductosPedidosItem> ProductosPedidos { get; set; } = null!;

    public ProductosPedidosContext(DbContextOptions<ProductosPedidosContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración explícita de la relación
        modelBuilder.Entity<ProductosPedidosItem>()
            .HasKey(pp => new { pp.NumPedido, pp.IdProducto }); // Clave primaria compuesta

    }
}
