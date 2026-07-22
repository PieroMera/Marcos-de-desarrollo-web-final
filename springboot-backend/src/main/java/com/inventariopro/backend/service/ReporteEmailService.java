package com.inventariopro.backend.service;

import com.inventariopro.backend.exception.ApiException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class ReporteEmailService {

    private final JavaMailSender mailSender;
    private final String remitente;

    public ReporteEmailService(JavaMailSender mailSender, @Value("${app.mail.from:}") String remitente) {
        this.mailSender = mailSender;
        this.remitente = remitente;
    }

    public void enviarReporteStock(String destinatario, byte[] csv, String nombreArchivo) {
        if (remitente == null || remitente.isBlank()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "El envio de correo no esta configurado en el servidor.");
        }
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setFrom(remitente);
            helper.setTo(destinatario);
            helper.setSubject("Reporte de stock - Inventario Pro");
            helper.setText(
                    "Hola,\n\nAdjunto encontraras el reporte de stock generado desde Inventario Pro.\n\nSaludos."
            );
            helper.addAttachment(nombreArchivo, new ByteArrayResource(csv), "text/csv");
            mailSender.send(mensaje);
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "No se pudo enviar el correo: " + ex.getMessage());
        }
    }
}
