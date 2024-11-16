using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class ProductosComercioItem  
{
    // Clave primaria compuesta: CedulaComercio + IdProducto
    [Key, Column(Order = 0)]
    [ForeignKey("ComercioAfiliado")]
    public required string CedulaComercio { get; set; }

    [Key, Column(Order = 1)]
    [ForeignKey("Producto")]
    public required int IdProducto { get; set; }

    // Relación con ComercioAfiliado
}
