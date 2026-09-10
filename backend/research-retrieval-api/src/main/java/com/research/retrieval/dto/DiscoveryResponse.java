package com.research.retrieval.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class DiscoveryResponse {

    private String status;

    private List<String> queries;

    private List<RelatedPaper> papers;

    public DiscoveryResponse() {
    }

    public DiscoveryResponse(String status,
                             List<String> queries,
                             List<RelatedPaper> papers) {

        this.status = status;
        this.queries = queries;
        this.papers = papers;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getQueries() {
        return queries;
    }

    public void setQueries(List<String> queries) {
        this.queries = queries;
    }

    public List<RelatedPaper> getPapers() {
        return papers;
    }

    public void setPapers(List<RelatedPaper> papers) {
        this.papers = papers;
    }

    public static class RelatedPaper {

        private String title;

        private List<String> authors;

        private Integer year;

        private String abstractText;

        private String doi;

        private String url;

        private String source;

        @JsonProperty("embedding_similarity")
        private Double embeddingSimilarity;

        @JsonProperty("rerank_score")
        private Double rerankScore;

        @JsonProperty("relationship_analysis")
        private String relationshipAnalysis;

        public RelatedPaper() {
        }

        public RelatedPaper(String title,
                             List<String> authors,
                             Integer year,
                             String abstractText,
                             String doi,
                             String url,
                             String source,
                             Double embeddingSimilarity,
                             Double rerankScore,
                             String relationshipAnalysis) {

            this.title = title;
            this.authors = authors;
            this.year = year;
            this.abstractText = abstractText;
            this.doi = doi;
            this.url = url;
            this.source = source;
            this.embeddingSimilarity = embeddingSimilarity;
            this.rerankScore = rerankScore;
            this.relationshipAnalysis = relationshipAnalysis;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public List<String> getAuthors() {
            return authors;
        }

        public void setAuthors(List<String> authors) {
            this.authors = authors;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

        public String getAbstractText() {
            return abstractText;
        }

        public void setAbstractText(String abstractText) {
            this.abstractText = abstractText;
        }

        public String getDoi() {
            return doi;
        }

        public void setDoi(String doi) {
            this.doi = doi;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public Double getEmbeddingSimilarity() {
            return embeddingSimilarity;
        }

        public void setEmbeddingSimilarity(Double embeddingSimilarity) {
            this.embeddingSimilarity = embeddingSimilarity;
        }

        public Double getRerankScore() {
            return rerankScore;
        }

        public void setRerankScore(Double rerankScore) {
            this.rerankScore = rerankScore;
        }

        public String getRelationshipAnalysis() {
            return relationshipAnalysis;
        }

        public void setRelationshipAnalysis(String relationshipAnalysis) {
            this.relationshipAnalysis = relationshipAnalysis;
        }
    }
}