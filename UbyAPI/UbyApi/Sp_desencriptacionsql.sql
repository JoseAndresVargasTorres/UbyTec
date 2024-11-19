USE [ubybase]
GO
/****** Object:  StoredProcedure [dbo].[clave_cliente]    Script Date: 11/19/2024 3:00:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[clave_cliente]
    @Usuario  NVARCHAR(50),
    @Password NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Crear el hash de la contrase�a ingresada
    DECLARE @HashPassword NVARCHAR(64) = CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', @Password), 2);

    -- Verificar si la c�dula y la contrase�a hash coinciden
    IF EXISTS (
        SELECT 1
        FROM Cliente
        WHERE usuario = @Usuario AND password = @HashPassword
    )
    BEGIN
        PRINT 'Autenticaci�n exitosa.';
        -- Opcional: Puedes devolver los datos del cliente si la autenticaci�n es v�lida
        SELECT 
            *
        FROM Cliente
        WHERE usuario = @Usuario;
    END
    ELSE
    BEGIN
          -- Si no existe el usuario o la contrase�a es incorrecta, retornar NULL
        SELECT 
			NULL AS cedula,
			NULL AS usuario,
			NULL AS password,
			NULL AS nombre,
			NULL AS apellido1,
			NULL AS apellido2,
			NULL AS correo,
			NULL AS fecha_nacimiento;
����END
END;