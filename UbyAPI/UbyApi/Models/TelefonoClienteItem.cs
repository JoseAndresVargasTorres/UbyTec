using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class TelefonoClienteItem
{
    // Clave primaria y clave foránea hacia Cliente
    [Key]
    public required int CedulaCliente { get; set; }

    // Teléfono
    [StringLength(20)] // Define una longitud máxima de 20 caracteres
    public required string Telefono { get; set; }

}
