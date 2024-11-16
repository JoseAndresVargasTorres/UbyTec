using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class ClienteContext : DbContext
{
    public DbSet<ClienteItem> Clientes { get; set; } = null!;

    public ClienteContext(DbContextOptions<ClienteContext> options)
        : base(options)
    {}
}
