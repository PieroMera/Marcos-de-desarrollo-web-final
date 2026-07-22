package com.inventariopro.backend.controller;

import com.inventariopro.backend.dto.MessageResponse;
import com.inventariopro.backend.dto.auth.*;
import com.inventariopro.backend.exception.ApiException;
import com.inventariopro.backend.model.Usuario;
import com.inventariopro.backend.repository.UsuarioRepository;
import com.inventariopro.backend.security.JwtAuthFilter;
import com.inventariopro.backend.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final List<String> ROLES = List.of("Administrador", "Encargado de almacen", "Vendedor");

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private Long currentUserId(HttpServletRequest request) {
        return (Long) request.getAttribute(JwtAuthFilter.USER_ID_ATTRIBUTE);
    }

    private Usuario requireUser(HttpServletRequest request) {
        Usuario u = usuarioRepository.findById(currentUserId(request)).orElse(null);
        if (u == null) throw ApiException.notFound("Usuario no encontrado.");
        return u;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("Ya existe una cuenta con ese correo.");
        }
        String rol = ROLES.contains(req.rol()) ? req.rol() : "Vendedor";

        Usuario u = new Usuario();
        u.setNombres(req.nombres().trim());
        u.setApellidos(req.apellidos() == null ? "" : req.apellidos().trim());
        u.setDocumento(req.documento() == null ? "" : req.documento().trim());
        u.setTelefono(req.telefono() == null ? "" : req.telefono().trim());
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setRol(rol);
        usuarioRepository.save(u);

        String token = jwtService.generateToken(u.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, UserResponse.from(u)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Usuario u = usuarioRepository.findByEmailIgnoreCase(req.email().trim().toLowerCase()).orElse(null);
        if (u == null || !passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw ApiException.unauthorized("Correo o contrasena incorrectos.");
        }
        String token = jwtService.generateToken(u.getId());
        return ResponseEntity.ok(new AuthResponse(token, UserResponse.from(u)));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Usuario u = requireUser(request);
        return ResponseEntity.ok(java.util.Map.of("user", UserResponse.from(u)));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(HttpServletRequest request, @RequestBody UpdateProfileRequest req) {
        Usuario u = requireUser(request);

        if (req.email() != null && !req.email().isBlank()) {
            String nuevoEmail = req.email().trim().toLowerCase();
            if (!nuevoEmail.equals(u.getEmail())) {
                boolean clash = usuarioRepository.findByEmailIgnoreCase(nuevoEmail)
                        .filter(other -> !other.getId().equals(u.getId()))
                        .isPresent();
                if (clash) throw ApiException.conflict("Ese correo ya esta en uso por otra cuenta.");
                u.setEmail(nuevoEmail);
            }
        }
        if (req.nombres() != null && !req.nombres().isBlank()) u.setNombres(req.nombres().trim());
        if (req.apellidos() != null) u.setApellidos(req.apellidos().trim());
        if (req.telefono() != null) u.setTelefono(req.telefono().trim());

        usuarioRepository.save(u);
        return ResponseEntity.ok(java.util.Map.of("user", UserResponse.from(u)));
    }

    @PutMapping("/password")
    public ResponseEntity<MessageResponse> updatePassword(HttpServletRequest request, @Valid @RequestBody ChangePasswordRequest req) {
        Usuario u = requireUser(request);
        if (!passwordEncoder.matches(req.currentPassword(), u.getPasswordHash())) {
            throw ApiException.unauthorized("La contrasena actual no es correcta.");
        }
        u.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        usuarioRepository.save(u);
        return ResponseEntity.ok(new MessageResponse("Contrasena actualizada correctamente."));
    }
}
