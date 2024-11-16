using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class ProductoContext : DbContext
{
    public DbSet<ProductoItem> Productos { get; set; } = null!;

    public ProductoContext(DbContextOptions<ProductoContext> options)
        : base(options)
    {}
}