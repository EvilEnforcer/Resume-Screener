package com.screen.resume_screener.Repository;

import com.screen.resume_screener.Entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {

    List<DocumentEntity> findByUsername(String username);

}
