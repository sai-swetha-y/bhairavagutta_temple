IF DB_ID(N'BhairavaguttaTemple') IS NULL
BEGIN
    CREATE DATABASE BhairavaguttaTemple;
END
GO

USE BhairavaguttaTemple;
GO

IF OBJECT_ID(N'dbo.TempleOfferings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.TempleOfferings
    (
        OfferingId INT IDENTITY(1,1) PRIMARY KEY,
        OfferingCode NVARCHAR(50) NOT NULL UNIQUE,
        OfferingName NVARCHAR(150) NOT NULL,
        OfferingType NVARCHAR(30) NOT NULL,
        Amount DECIMAL(12,2) NOT NULL,
        Description NVARCHAR(400) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_TempleOfferings_IsActive DEFAULT (1),
        CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_TempleOfferings_CreatedAt DEFAULT SYSDATETIMEOFFSET()
    );
END
GO

IF OBJECT_ID(N'dbo.TemplePayments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.TemplePayments
    (
        PaymentId INT IDENTITY(1,1) PRIMARY KEY,
        TransactionId NVARCHAR(40) NOT NULL,
        ReceiptNumber NVARCHAR(40) NOT NULL,
        DevoteeName NVARCHAR(120) NOT NULL,
        Gothram NVARCHAR(120) NOT NULL,
        CustomGothram NVARCHAR(120) NULL,
        Nakshatram NVARCHAR(60) NOT NULL,
        Padam INT NOT NULL,
        Raashi NVARCHAR(40) NOT NULL,
        Sankalpam NVARCHAR(MAX) NULL,
        OfferingCode NVARCHAR(50) NOT NULL,
        OfferingName NVARCHAR(150) NOT NULL,
        OfferingType NVARCHAR(30) NOT NULL,
        Amount DECIMAL(12,2) NOT NULL,
        PaymentChannel NVARCHAR(30) NOT NULL,
        PaymentMethod NVARCHAR(20) NOT NULL,
        PaymentStatus NVARCHAR(20) NOT NULL,
        ExternalTransactionId NVARCHAR(120) NULL,
        ApprovalReferenceNo NVARCHAR(120) NULL,
        PaymentResponse NVARCHAR(MAX) NULL,
        DeviceInfo NVARCHAR(500) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_TemplePayments_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_TemplePayments_UpdatedAt DEFAULT SYSDATETIMEOFFSET(),
        CompletedAt DATETIMEOFFSET NULL,
        CONSTRAINT UQ_TemplePayments_TransactionId UNIQUE (TransactionId),
        CONSTRAINT CK_TemplePayments_Padam CHECK (Padam BETWEEN 1 AND 4),
        CONSTRAINT CK_TemplePayments_PaymentStatus CHECK (PaymentStatus IN ('INITIATED', 'SUCCESS', 'OFFLINE', 'FAILED', 'PENDING'))
    );
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.TemplePayments')
      AND name = N'IX_TemplePayments_CreatedAt'
)
BEGIN
    CREATE INDEX IX_TemplePayments_CreatedAt
        ON dbo.TemplePayments (CreatedAt);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.TemplePayments')
      AND name = N'IX_TemplePayments_Status'
)
BEGIN
    CREATE INDEX IX_TemplePayments_Status
        ON dbo.TemplePayments (PaymentStatus, PaymentChannel);
END
GO
