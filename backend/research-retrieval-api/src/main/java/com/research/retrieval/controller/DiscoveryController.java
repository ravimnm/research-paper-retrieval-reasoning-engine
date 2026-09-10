package com.research.retrieval.controller;

import com.research.retrieval.dto.DiscoveryRequest;
import com.research.retrieval.dto.DiscoveryResponse;
import com.research.retrieval.service.DiscoveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @PostMapping
    public ResponseEntity<DiscoveryResponse> discover(
            @Valid @RequestBody DiscoveryRequest request) {

        DiscoveryResponse response =
                discoveryService.discover(
                        request.getPaperId(),
                        request.getQuery(),
                        request.getTopK()
                );

        return ResponseEntity.ok(response);
    }
}