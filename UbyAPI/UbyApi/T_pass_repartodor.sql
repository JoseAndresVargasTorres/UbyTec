USE [ubybase]
GO
/****** Object:  Trigger [dbo].[trig_contraseña_repartidor]    Script Date: 21/11/2024 18:48:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TRIGGER [dbo].[trig_contraseña_repartidor]
ON [dbo].[Repartidor]
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE Repartidor
    SET password = CONVERT(nvarchar(64), HASHBYTES('SHA2_256', I.password), 2)
    FROM Repartidor R
    INNER JOIN INSERTED I ON R.id = I.id;
END;

