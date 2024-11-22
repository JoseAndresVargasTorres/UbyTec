USE [ubybase]
GO
/****** Object:  Trigger [dbo].[trig_contraseña]    Script Date: 21/11/2024 18:27:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TRIGGER [dbo].[trig_contraseña]
ON [dbo].[Cliente]
AFTER INSERT, UPDATE
AS
BEGIN
    -- Encriptar la contraseña al insertar
    UPDATE Cliente
    SET password = CONVERT(nvarchar(64), HASHBYTES('SHA2_256', I.password), 2)
    FROM Cliente C
    INNER JOIN INSERTED I ON C.cedula = I.cedula;
END;
