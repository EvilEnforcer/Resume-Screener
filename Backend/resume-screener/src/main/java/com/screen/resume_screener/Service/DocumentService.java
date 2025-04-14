package com.screen.resume_screener.Service;

import com.screen.resume_screener.Repository.DocumentRepository;
import com.screen.resume_screener.Entity.DocumentEntity;
import com.screen.resume_screener.dto.DocumentResponse;
import com.screen.resume_screener.dto.JobRequest;
import com.screen.resume_screener.dto.JobResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public DocumentResponse saveDocument(String username, MultipartFile multipartFile) throws IOException {
        DocumentEntity documentEntity = new DocumentEntity();
        documentEntity.setUsername(username);
        documentEntity.setFilename(multipartFile.getOriginalFilename());
        documentEntity.setFiletype(multipartFile.getContentType());
        documentEntity.setData(multipartFile.getBytes());

        DocumentEntity saved = documentRepository.save(documentEntity);

        return new DocumentResponse(
                saved.getId(),
                saved.getFilename(),
                saved.getFiletype(),
                saved.getData().length,
                saved.getUploadedAt()
        );
    }

    public DocumentEntity getDocumentForUser(String username, Long id) {
        return documentRepository.findById(id)
                .filter(doc -> doc.getUsername().equals(username))
                .orElse(null);
    }

    public List<DocumentResponse> getUserDocuments(String username) {
        List<DocumentEntity> docs = documentRepository.findByUsername(username);

        return docs.stream()
                .map(doc -> new DocumentResponse(
                        doc.getId(),
                        doc.getFilename(),
                        doc.getFiletype(),
                        doc.getData().length,
                        doc.getUploadedAt()
                ))
                .toList();
    }

    //Testing CI/CD Pipeline

}
