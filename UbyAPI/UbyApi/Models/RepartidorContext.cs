using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class RepartidorContext : DbContext
{
    public DbSet<RepartidorItem> Repartidores { get; set; } = null!;

    public RepartidorContext(DbContextOptions<RepartidorContext> options)
        : base(options)
    {}
}
