package com.research.retrieval.controller;

import com.research.retrieval.entity.ResearchPaper;
import com.research.retrieval.service.PaperService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/papers")
public class PaperController {

    private final PaperService paperService;

    public PaperController(PaperService paperService) {
        this.paperService = paperService;
    }

    @PostMapping
    public ResponseEntity<ResearchPaper> createPaper(
            @RequestBody ResearchPaper paper) {

        return ResponseEntity.ok(
                paperService.createPaper(paper)
        );
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResearchPaper> uploadPaper(
            @RequestParam("file") MultipartFile file) {

        ResearchPaper paper =
                paperService.uploadPaper(file);

        return ResponseEntity.ok(paper);
    }

    @GetMapping
    public ResponseEntity<List<ResearchPaper>> getAllPapers() {

        return ResponseEntity.ok(
                paperService.getAllPapers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResearchPaper> getPaper(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paperService.getPaper(id)
        );
    }

    @GetMapping("/local")
    public ResponseEntity<List<ResearchPaper>> getLocalPapers() {

        return ResponseEntity.ok(
                paperService.getLocalPapers()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(
            @PathVariable Long id) {

        paperService.deletePaper(id);

        return ResponseEntity.noContent().build();
    }
}