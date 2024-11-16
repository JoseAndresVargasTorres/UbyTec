using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class ValidacionComercioItem
{
    // Clave primaria (cedula_admin)
    [Key]
    public required int CedulaAdmin { get; set; }

    // Clave foránea única hacia ComercioAfiliado
    public required string CedulaComercio { get; set; }

    // Comentario opcional
    [Column(TypeName = "TEXT")] // Utilizamos el tipo 'TEXT' para comentarios largos
    public string? Comentario { get; set; }

    // Estado
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Estado { get; set; }
}
