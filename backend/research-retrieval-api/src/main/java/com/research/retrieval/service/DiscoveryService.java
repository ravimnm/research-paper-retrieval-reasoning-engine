package com.research.retrieval.service;

import com.research.retrieval.client.AiEngineClient;
import com.research.retrieval.dto.DiscoveryResponse;
import com.research.retrieval.entity.ResearchPaper;
import com.research.retrieval.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DiscoveryService {

    private final AiEngineClient aiEngineClient;
    private final PaperService paperService;

    public DiscoveryService(AiEngineClient aiEngineClient,
                            PaperService paperService) {
        this.aiEngineClient = aiEngineClient;
        this.paperService = paperService;
    }

    public DiscoveryResponse discover(Long paperId,
                                      String query,
                                      int topK) {

        ResearchPaper paper = paperService.getPaper(paperId);

        if (!"LOCAL".equalsIgnoreCase(paper.getSourceType())) {
            throw new ResourceNotFoundException(
                    "Discovery requires a locally uploaded research paper"
            );
        }

        return aiEngineClient.discover(
                query,
                3,
                5,
                20,
                topK,
                3
        );
    }
}