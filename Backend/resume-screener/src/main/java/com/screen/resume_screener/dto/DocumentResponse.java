package com.screen.resume_screener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DocumentResponse {

    @Schema(description = "File ID", example = "4")
    private Long id;

    @Schema(description = "File name", example = "Resume.pdf")
    private String filename;

    @Schema(description = "File type", example = "application/pdf")
    private String filetype;

    @Schema(description = "File size", example = "256")
    private long size;

    @Schema(description = "Uploaded At", example = "2025-04-08 10:10:59.199996")
    private LocalDateTime uploadedAt;

    public DocumentResponse(Long id, String filename,
                            String filetype, long size, LocalDateTime uploadedAt) {
        this.id = id;
        this.filename = filename;
        this.filetype = filetype;
        this.size = size;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getFiletype() {
        return filetype;
    }

    public void setFiletype(String filetype) {
        this.filetype = filetype;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

}
