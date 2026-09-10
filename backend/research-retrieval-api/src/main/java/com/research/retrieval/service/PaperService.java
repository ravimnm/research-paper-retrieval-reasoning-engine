package com.research.retrieval.service;

import com.research.retrieval.client.AiEngineClient;
import com.research.retrieval.entity.ResearchPaper;
import com.research.retrieval.exception.ResourceNotFoundException;
import com.research.retrieval.repository.ResearchPaperRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaperService {

    private final ResearchPaperRepository paperRepository;
    private final AiEngineClient aiEngineClient;

    @Value("${file.upload-dir:uploads/papers}")
    private String uploadDirectory;

    public PaperService(ResearchPaperRepository paperRepository,
                        AiEngineClient aiEngineClient) {

        this.paperRepository = paperRepository;
        this.aiEngineClient = aiEngineClient;
    }

    public ResearchPaper createPaper(ResearchPaper paper) {
        return paperRepository.save(paper);
    }

    public ResearchPaper getPaper(Long id) {

        return paperRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Research paper not found: " + id
                        ));
    }

    public List<ResearchPaper> getAllPapers() {
        return paperRepository.findAll();
    }

    public List<ResearchPaper> getLocalPapers() {
        return paperRepository.findBySourceType("LOCAL");
    }

    public ResearchPaper uploadPaper(MultipartFile file) {

        validatePdf(file);

        try {

            Path uploadPath = Paths.get(uploadDirectory)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadPath);

            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null ||
                    originalFileName.isBlank()) {

                throw new IllegalArgumentException(
                        "Uploaded file must have a valid filename"
                );
            }

            String safeFileName = Paths.get(originalFileName)
                    .getFileName()
                    .toString();

            String storedFileName =
                    UUID.randomUUID() + "_" + safeFileName;

            Path targetPath = uploadPath.resolve(storedFileName);

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            /*
             * Save paper metadata to PostgreSQL.
             */
            ResearchPaper paper = new ResearchPaper();

            paper.setTitle(removePdfExtension(safeFileName));
            paper.setFileName(safeFileName);
            paper.setFilePath(targetPath.toString());
            paper.setSourceType("LOCAL");
            paper.setUploadedAt(LocalDateTime.now());

            ResearchPaper savedPaper =
                    paperRepository.save(paper);

            /*
             * Send the actual PDF to the Python AI engine.
             *
             * Spring stores the PDF locally, then sends the same
             * file to FastAPI /upload for:
             *
             * PDF extraction
             * chunking
             * embeddings
             * FAISS indexing
             * BM25 indexing
             */
            FileSystemResource pdfResource =
                    new FileSystemResource(targetPath.toFile());

            aiEngineClient.uploadToAiEngine(pdfResource);

            return savedPaper;

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Failed to store uploaded PDF",
                    exception
            );
        }
    }

    public void deletePaper(Long id) {

        ResearchPaper paper = getPaper(id);

        if (paper.getFilePath() != null) {

            try {

                Path filePath =
                        Paths.get(paper.getFilePath());

                Files.deleteIfExists(filePath);

            } catch (IOException exception) {

                throw new RuntimeException(
                        "Failed to delete paper file",
                        exception
                );
            }
        }

        paperRepository.deleteById(id);
    }

    private void validatePdf(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "PDF file cannot be empty"
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null ||
                !fileName.toLowerCase().endsWith(".pdf")) {

            throw new IllegalArgumentException(
                    "Only PDF files are supported"
            );
        }

        /*
         * Do not rely only on MultipartFile.getContentType().
         *
         * A PDF file starts with the magic bytes:
         *
         * %PDF
         */
        try (InputStream inputStream =
                     file.getInputStream()) {

            byte[] header = new byte[4];

            int bytesRead = inputStream.read(header);

            if (bytesRead < 4 ||
                    header[0] != '%' ||
                    header[1] != 'P' ||
                    header[2] != 'D' ||
                    header[3] != 'F') {

                throw new IllegalArgumentException(
                        "Uploaded file is not a valid PDF"
                );
            }

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Unable to validate uploaded PDF",
                    exception
            );
        }
    }

    private String removePdfExtension(String fileName) {

        if (fileName.toLowerCase().endsWith(".pdf")) {

            return fileName.substring(
                    0,
                    fileName.length() - 4
            );
        }

        return fileName;
    }
}