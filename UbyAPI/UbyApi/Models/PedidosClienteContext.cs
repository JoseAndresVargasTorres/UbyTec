using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;

public class PedidosClienteContext : DbContext
{
    public DbSet<PedidosClienteItem> PedidosClientes { get; set; } = null!;

    public PedidosClienteContext(DbContextOptions<PedidosClienteContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar las relaciones
        modelBuilder.Entity<PedidosClienteItem>()
            .HasKey(pc => pc.NumPedido); // Establecer 'NumPedido' como clave primaria

    }
}
