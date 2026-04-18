USE BhairavaguttaTemple;
GO

CREATE OR ALTER PROCEDURE dbo.usp_CreateTemplePayment
    @TransactionId NVARCHAR(40),
    @ReceiptNumber NVARCHAR(40),
    @DevoteeName NVARCHAR(120),
    @Gothram NVARCHAR(120),
    @CustomGothram NVARCHAR(120) = NULL,
    @Nakshatram NVARCHAR(60),
    @Padam INT,
    @Raashi NVARCHAR(40),
    @Sankalpam NVARCHAR(MAX) = NULL,
    @OfferingCode NVARCHAR(50),
    @OfferingName NVARCHAR(150),
    @OfferingType NVARCHAR(30),
    @Amount DECIMAL(12,2),
    @PaymentChannel NVARCHAR(30),
    @PaymentMethod NVARCHAR(20),
    @PaymentStatus NVARCHAR(20),
    @DeviceInfo NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TemplePayments
    (
        TransactionId,
        ReceiptNumber,
        DevoteeName,
        Gothram,
        CustomGothram,
        Nakshatram,
        Padam,
        Raashi,
        Sankalpam,
        OfferingCode,
        OfferingName,
        OfferingType,
        Amount,
        PaymentChannel,
        PaymentMethod,
        PaymentStatus,
        DeviceInfo
    )
    VALUES
    (
        @TransactionId,
        @ReceiptNumber,
        @DevoteeName,
        @Gothram,
        @CustomGothram,
        @Nakshatram,
        @Padam,
        @Raashi,
        @Sankalpam,
        @OfferingCode,
        @OfferingName,
        @OfferingType,
        @Amount,
        @PaymentChannel,
        @PaymentMethod,
        @PaymentStatus,
        @DeviceInfo
    );

    SELECT *
    FROM dbo.TemplePayments
    WHERE TransactionId = @TransactionId;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_UpdateTemplePaymentStatus
    @TransactionId NVARCHAR(40),
    @PaymentStatus NVARCHAR(20),
    @ExternalTransactionId NVARCHAR(120) = NULL,
    @ApprovalReferenceNo NVARCHAR(120) = NULL,
    @PaymentResponse NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.TemplePayments
    SET
        PaymentStatus = @PaymentStatus,
        ExternalTransactionId = @ExternalTransactionId,
        ApprovalReferenceNo = @ApprovalReferenceNo,
        PaymentResponse = @PaymentResponse,
        UpdatedAt = SYSDATETIMEOFFSET(),
        CompletedAt = CASE
            WHEN @PaymentStatus IN ('SUCCESS', 'OFFLINE') THEN SYSDATETIMEOFFSET()
            ELSE CompletedAt
        END
    WHERE TransactionId = @TransactionId;

    SELECT *
    FROM dbo.TemplePayments
    WHERE TransactionId = @TransactionId;
END
GO

CREATE OR ALTER VIEW dbo.vw_TemplePaymentReceipts
AS
SELECT
    PaymentId,
    TransactionId,
    ReceiptNumber,
    DevoteeName,
    Gothram,
    CustomGothram,
    Nakshatram,
    Padam,
    Raashi,
    Sankalpam,
    OfferingName,
    OfferingType,
    Amount,
    PaymentChannel,
    PaymentStatus,
    ExternalTransactionId,
    ApprovalReferenceNo,
    CreatedAt,
    CompletedAt
FROM dbo.TemplePayments;
GO
