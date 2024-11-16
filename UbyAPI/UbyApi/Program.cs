using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Obtener la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("SampleDbConnection");

// Configurar los DbContext dentro del contenedor de inyección de dependencias (DI)
builder.Services.AddDbContext<AdministradorContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ClienteContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ComercioAfiliadoContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<DireccionAdministradorContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<DireccionComercioContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<DireccionPedidoContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<DireccionRepartidorContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<PedidoContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<PedidosClienteContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ProductoContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ProductosComercioContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ProductosPedidosContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<RepartidorContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<TarjetaCreditoContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<TelefonoAdminContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<TelefonoClienteContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<TelefonoComercioContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<TelefonoRepartidorContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<TipoComercioContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ValidacionComercioContext>(options =>
    options.UseNpgsql(connectionString));

// Configurar servicios
builder.Services.AddControllers();
// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Configuración de CORS
#region Config. CORS
app.UseCors(options =>
    options.WithOrigins("http://localhost:4200")
           .AllowAnyHeader()
           .AllowAnyMethod());
#endregion

app.UseAuthorization();

app.MapControllers();

app.Run();
