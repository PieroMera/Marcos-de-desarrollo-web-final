package com.inventariopro.backend.dto.auth;

public record UpdateProfileRequest(
        String nombres,
        String apellidos,
        String telefono,
        String email
) {
}
