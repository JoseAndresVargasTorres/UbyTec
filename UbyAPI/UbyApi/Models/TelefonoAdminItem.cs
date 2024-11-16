using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class TelefonoAdminItem
{
    // Clave primaria y clave foránea hacia Administrador
    [Key]
    public required int CedulaAdmin { get; set; }

    // Teléfono
    [StringLength(20)] // Define una longitud máxima de 20 caracteres
    public required string Telefono { get; set; }

}
