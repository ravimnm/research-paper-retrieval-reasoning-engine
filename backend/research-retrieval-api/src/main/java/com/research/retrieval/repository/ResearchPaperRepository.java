package com.research.retrieval.repository;

import com.research.retrieval.entity.ResearchPaper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResearchPaperRepository
        extends JpaRepository<ResearchPaper, Long> {

    List<ResearchPaper> findBySourceType(String sourceType);

    List<ResearchPaper> findByTitleContainingIgnoreCase(String title);
}
