package com.research.retrieval.service;

import com.research.retrieval.client.AiEngineClient;
import com.research.retrieval.dto.RetrievalResponse;
import org.springframework.stereotype.Service;

@Service
public class RetrievalService {

    private final AiEngineClient aiEngineClient;

    public RetrievalService(AiEngineClient aiEngineClient) {
        this.aiEngineClient = aiEngineClient;
    }

    public RetrievalResponse retrieve(String query, int topK) {
        return aiEngineClient.retrieve(query, topK);
    }
}