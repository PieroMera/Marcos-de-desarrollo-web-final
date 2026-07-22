package com.inventariopro.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Debe indicar la contrasena actual") String currentPassword,
        @NotBlank(message = "Debe indicar la nueva contrasena")
        @Size(min = 6, message = "La nueva contrasena debe tener al menos 6 caracteres") String newPassword
) {
}
