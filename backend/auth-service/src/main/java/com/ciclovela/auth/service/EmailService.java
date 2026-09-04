package com.ciclovela.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String token) {
        // Link untuk reset yang akan diarahkan ke Frontend Vite kita
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@ciclovela.com");
        message.setTo(toEmail);
        message.setSubject("Permintaan Reset Password - CICLOVELA");
        message.setText("Halo,\n\nKami menerima permintaan reset password untuk akun Anda di CICLOVELA.\n" +
                "Silakan klik link di bawah ini untuk membuat password baru:\n\n" +
                resetLink + "\n\n" +
                "Jika Anda tidak merasa meminta reset password, abaikan saja email ini.\n\n" +
                "Salam,\nTim CICLOVELA");

        try {
            System.out.println("=================================================");
            System.out.println("SIMULASI EMAIL TERKIRIM KE: " + toEmail);
            System.out.println("LINK RESET: " + resetLink);
            System.out.println("TOKEN OTP: " + token);
            System.out.println("=================================================");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Gagal mengirim email ke " + toEmail + ". (Bisa diabaikan jika SMTP tidak disetup)");
        }
    }
}
