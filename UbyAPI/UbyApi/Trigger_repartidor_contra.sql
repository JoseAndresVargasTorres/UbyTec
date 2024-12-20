USE [ubybase]
GO
/****** Object:  Trigger [dbo].[trig_contraseña_repartidor]    Script Date: 20/11/2024 17:54:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TRIGGER [dbo].[trig_contraseña_repartidor]
ON [dbo].[Repartidor]
AFTER INSERT
AS
BEGIN
    UPDATE Repartidor
    SET password = CONVERT(nvarchar(64), HASHBYTES('SHA2_256', I.password), 2)
    FROM Repartidor R
    INNER JOIN INSERTED I ON R.id = I.id;
END;