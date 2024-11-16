using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class PedidosClienteItem
{
    // Clave primaria
    [Key]
    public int NumPedido { get; set; }

    // Clave foránea hacia la tabla Cliente
    public int CedulaCliente { get; set; }

    // Feedback opcional
    [Column(TypeName = "TEXT")] // Utilizamos el tipo 'TEXT' para el feedback
    public string? Feedback { get; set; }

}
