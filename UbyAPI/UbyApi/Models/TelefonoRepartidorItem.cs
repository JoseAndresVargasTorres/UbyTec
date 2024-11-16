using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class TelefonoRepartidorItem
{
    // Clave primaria y clave foránea hacia Repartidor
    [Key]
    public required int CedulaRepartidor { get; set; }

    // Teléfono
    [StringLength(20)] // Define una longitud máxima de 20 caracteres
    public required string Telefono { get; set; }
}