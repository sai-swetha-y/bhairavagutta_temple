USE BhairavaguttaTemple;
GO

MERGE dbo.TempleOfferings AS target
USING (
    VALUES
        (N'TILA_TAILABHISHEKAM', N'Thila Thailabhishekam to Shaneeswara Swamy', N'Pooja', 200.00, N'Sacred oil abhishekam seva for Sri Abhaya Shaneeswara Swamy.'),
        (N'KALA_BHAIRAVA_ABHISHEKAM', N'Abhishekam to Kala Bhairava Swamy', N'Pooja', 300.00, N'Abhishekam seva offered to Sri Maha Kala Bhairava Swamy.'),
        (N'KUSHMANDA_DEEPA_SEVA', N'Kushmanda Deepa Seva', N'Pooja', 500.00, N'Deepa seva offered with spiritual sankalpam.'),
        (N'HOMAM', N'Homam', N'Pooja', 10116.00, N'Homam seva performed with temple sankalpam.'),
        (N'ABHISHEKAM_SET', N'Abhishekam Set', N'Pooja Set', 400.00, N'Temple-prepared abhishekam material set.'),
        (N'KOOSHMANDA_DEEPAM_SET', N'Kooshmanda Deepam Set', N'Pooja Set', 300.00, N'Deepam set for Kushmanda seva.')
) AS source (OfferingCode, OfferingName, OfferingType, Amount, Description)
ON target.OfferingCode = source.OfferingCode
WHEN MATCHED THEN
    UPDATE SET
        OfferingName = source.OfferingName,
        OfferingType = source.OfferingType,
        Amount = source.Amount,
        Description = source.Description,
        IsActive = 1
WHEN NOT MATCHED BY TARGET THEN
    INSERT (OfferingCode, OfferingName, OfferingType, Amount, Description)
    VALUES (source.OfferingCode, source.OfferingName, source.OfferingType, source.Amount, source.Description);
GO
