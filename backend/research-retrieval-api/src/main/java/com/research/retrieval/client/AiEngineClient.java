package com.research.retrieval.client;

import com.research.retrieval.dto.DiscoveryResponse;
import com.research.retrieval.dto.RetrievalResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Component
public class AiEngineClient {

    private final RestClient restClient;

    @Value("${ai-engine.base-url:http://localhost:8000}")
    private String aiEngineBaseUrl;

    public AiEngineClient(RestClient restClient) {
        this.restClient = restClient;
    }

    /*
     * Ask the AI engine questions about the currently indexed paper.
     */
    public RetrievalResponse retrieve(String query, int topK) {

        return restClient.post()
                .uri(aiEngineBaseUrl + "/retrieve")
                .body(new RetrievalClientRequest(query, topK))
                .retrieve()
                .body(RetrievalResponse.class);
    }

    /*
     * Upload the actual PDF to the AI engine.
     *
     * FastAPI:
     * POST /upload
     */
    public void uploadToAiEngine(Resource pdf) {

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("file", pdf);

        restClient.post()
                .uri(aiEngineBaseUrl + "/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    /*
     * Discover related research using the currently indexed paper.
     *
     * FastAPI:
     * POST /discover
     */
    public DiscoveryResponse discover(
            String query,
            int numQueries,
            int resultsPerQuery,
            int candidateK,
            int topK,
            int explainTop) {

        DiscoveryClientRequest request =
                new DiscoveryClientRequest(
                        query,
                        numQueries,
                        resultsPerQuery,
                        candidateK,
                        topK,
                        explainTop
                );

        return restClient.post()
                .uri(aiEngineBaseUrl + "/discover")
                .body(request)
                .retrieve()
                .body(DiscoveryResponse.class);
    }

    /*
     * Request sent to FastAPI /retrieve.
     */
    private static class RetrievalClientRequest {

        private String query;
        private int topK;

        public RetrievalClientRequest(
                String query,
                int topK) {

            this.query = query;
            this.topK = topK;
        }

        public String getQuery() {
            return query;
        }

        public int getTopK() {
            return topK;
        }
    }

    /*
     * Request sent to FastAPI /discover.
     */
    private static class DiscoveryClientRequest {

        private String query;
        private int num_queries;
        private int results_per_query;
        private int candidate_k;
        private int top_k;
        private int explain_top;

        public DiscoveryClientRequest(
                String query,
                int numQueries,
                int resultsPerQuery,
                int candidateK,
                int topK,
                int explainTop) {

            this.query = query;
            this.num_queries = numQueries;
            this.results_per_query = resultsPerQuery;
            this.candidate_k = candidateK;
            this.top_k = topK;
            this.explain_top = explainTop;
        }

        public String getQuery() {
            return query;
        }

        public int getNum_queries() {
            return num_queries;
        }

        public int getResults_per_query() {
            return results_per_query;
        }

        public int getCandidate_k() {
            return candidate_k;
        }

        public int getTop_k() {
            return top_k;
        }

        public int getExplain_top() {
            return explain_top;
        }
    }
}