using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class PedidoContext : DbContext
{
    public DbSet<PedidoItem> Pedidos { get; set; } = null!;

    public PedidoContext(DbContextOptions<PedidoContext> options)
        : base(options)
    {}
}
