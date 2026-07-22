package com.inventariopro.backend.dto.auth;

import com.inventariopro.backend.model.Usuario;

public record UserResponse(
        Long id,
        String nombre,
        String nombres,
        String apellidos,
        String documento,
        String telefono,
        String email,
        String rol,
        String createdAt
) {
    public static UserResponse from(Usuario u) {
        return new UserResponse(
                u.getId(),
                u.nombreCompleto(),
                u.getNombres(),
                u.getApellidos(),
                u.getDocumento(),
                u.getTelefono(),
                u.getEmail(),
                u.getRol(),
                u.getCreatedAt().toString()
        );
    }
}
