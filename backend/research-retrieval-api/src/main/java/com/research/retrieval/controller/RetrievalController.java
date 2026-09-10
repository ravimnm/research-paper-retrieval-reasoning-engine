package com.research.retrieval.controller;

import com.research.retrieval.dto.RetrievalRequest;
import com.research.retrieval.dto.RetrievalResponse;
import com.research.retrieval.service.RetrievalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/retrieval")
public class RetrievalController {

    private final RetrievalService retrievalService;

    public RetrievalController(RetrievalService retrievalService) {
        this.retrievalService = retrievalService;
    }

    @PostMapping
    public ResponseEntity<RetrievalResponse> retrieve(
            @Valid @RequestBody RetrievalRequest request) {

        RetrievalResponse response =
                retrievalService.retrieve(
                        request.getQuery(),
                        request.getTopK()
                );

        return ResponseEntity.ok(response);
    }
}
