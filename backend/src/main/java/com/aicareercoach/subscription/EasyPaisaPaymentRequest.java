package com.aicareercoach.subscription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload for submitting EasyPaisa payment transaction ID.
 */
public class EasyPaisaPaymentRequest {

    @NotBlank(message = "EasyPaisa Transaction ID (Trx ID) is required")
    @Size(min = 4, max = 100, message = "Transaction ID must be valid")
    private String transactionId;

    private String senderPhone;

    public EasyPaisaPaymentRequest() {
    }

    public EasyPaisaPaymentRequest(String transactionId, String senderPhone) {
        this.transactionId = transactionId;
        this.senderPhone = senderPhone;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public void setSenderPhone(String senderPhone) {
        this.senderPhone = senderPhone;
    }
}
