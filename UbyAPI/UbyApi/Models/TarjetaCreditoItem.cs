using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class TarjetaCreditoItem
{
    // Número de tarjeta como clave primaria
    [Key]
    public required long NumeroTarjeta { get; set; }

    // Cédula del cliente como clave foránea
    public required int CedulaCliente { get; set; }

    // Fecha de vencimiento
    [Column(TypeName = "DATE")] // Define el tipo como DATE
    public required DateTime FechaVencimiento { get; set; }

    // Código de seguridad CVV
    public required int Cvv { get; set; }

}
