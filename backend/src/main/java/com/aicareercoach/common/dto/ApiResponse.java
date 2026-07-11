package com.aicareercoach.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Generic API response wrapper.
 * All API responses follow this structure as defined in docs/10-api-plan.md.
 *
 * @param <T> the type of the payload data
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final String status;
    private final String message;
    private final T data;

    private ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("success", null, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("error", message, null);
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
}
