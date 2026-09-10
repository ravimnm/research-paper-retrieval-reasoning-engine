package com.research.retrieval.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RetrievalResponse {

    private String status;

    private String query;

    private String answer;

    private List<Source> sources;

    public RetrievalResponse() {
    }

    public RetrievalResponse(String status,
                             String query,
                             String answer,
                             List<Source> sources) {
        this.status = status;
        this.query = query;
        this.answer = answer;
        this.sources = sources;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<Source> getSources() {
        return sources;
    }

    public void setSources(List<Source> sources) {
        this.sources = sources;
    }

    public static class Source {

        @JsonProperty("chunk_id")
        private Integer chunkId;

        private Long paperId;

        private String paper;

        private Integer page;

        private Double score;

        @JsonProperty("fusion_score")
        private Double fusionScore;

        @JsonProperty("rerank_score")
        private Double rerankScore;

        private String text;

        public Source() {
        }

        public Source(Integer chunkId,
                      Long paperId,
                      String paper,
                      Integer page,
                      Double score,
                      Double fusionScore,
                      Double rerankScore,
                      String text) {

            this.chunkId = chunkId;
            this.paperId = paperId;
            this.paper = paper;
            this.page = page;
            this.score = score;
            this.fusionScore = fusionScore;
            this.rerankScore = rerankScore;
            this.text = text;
        }

        public Integer getChunkId() {
            return chunkId;
        }

        public void setChunkId(Integer chunkId) {
            this.chunkId = chunkId;
        }

        public Long getPaperId() {
            return paperId;
        }

        public void setPaperId(Long paperId) {
            this.paperId = paperId;
        }

        public String getPaper() {
            return paper;
        }

        public void setPaper(String paper) {
            this.paper = paper;
        }

        public Integer getPage() {
            return page;
        }

        public void setPage(Integer page) {
            this.page = page;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }

        public Double getFusionScore() {
            return fusionScore;
        }

        public void setFusionScore(Double fusionScore) {
            this.fusionScore = fusionScore;
        }

        public Double getRerankScore() {
            return rerankScore;
        }

        public void setRerankScore(Double rerankScore) {
            this.rerankScore = rerankScore;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}