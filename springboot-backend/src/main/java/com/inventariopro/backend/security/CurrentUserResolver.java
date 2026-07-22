package com.inventariopro.backend.security;

import com.inventariopro.backend.exception.ApiException;
import com.inventariopro.backend.model.Usuario;
import com.inventariopro.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CurrentUserResolver {

    private final UsuarioRepository usuarioRepository;

    public CurrentUserResolver(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario resolve(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute(JwtAuthFilter.USER_ID_ATTRIBUTE);
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado."));
    }

    public void requireRole(Usuario usuario, String... rolesPermitidos) {
        boolean permitido = Arrays.asList(rolesPermitidos).contains(usuario.getRol());
        if (!permitido) {
            throw ApiException.forbidden("No tienes permisos para realizar esta accion.");
        }
    }
}
