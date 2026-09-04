package com.ciclovela.catalog.service;

import com.ciclovela.catalog.exception.BadRequestException;
import com.ciclovela.catalog.exception.ResourceNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Tidak dapat membuat direktori penyimpanan file.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");

        try {
            if (originalName.contains("..")) {
                throw new BadRequestException("Path file tidak valid " + originalName);
            }

            // Batasi jenis file (Hanya Gambar atau PDF)
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                throw new BadRequestException("Hanya file Gambar (JPG/PNG) dan PDF yang diizinkan.");
            }

            String newFileName = UUID.randomUUID().toString() + "_" + originalName;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            
            // Simpan ke disk (Timpa kalau ada yang namanya sama)
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Gagal menyimpan file " + originalName, ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File tidak ditemukan " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File tidak ditemukan atau path salah: " + fileName);
        }
    }
}
