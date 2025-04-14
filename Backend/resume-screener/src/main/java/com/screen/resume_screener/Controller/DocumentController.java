package com.screen.resume_screener.Controller;

import com.screen.resume_screener.Service.DocumentService;
import com.screen.resume_screener.Service.ResumeService;
import com.screen.resume_screener.dto.DocumentResponse;
import com.screen.resume_screener.dto.ErrorResponse;
import com.screen.resume_screener.dto.JobRequest;
import com.screen.resume_screener.dto.JobResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/document")
@Tag(name = "Resume Functions", description = "API for resume related functions")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ResumeService resumeService;

    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Uploads Resume",
                description = "Lets the user upload a file to the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File uploaded successfully",
                    content = @Content(schema = @Schema(implementation = DocumentResponse.class))),

            @ApiResponse(responseCode = "400", description = "Bad request – invalid or empty file",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "EmptyFile",
                                            summary = "No file uploaded",
                                            value = "{\"message\": \"File cannot be empty!\"}"
                                    ),
                                    @ExampleObject(
                                            name = "InvalidFileType",
                                            summary = "Only PDF and DOCX allowed",
                                            value = "{\"message\": \"Only PDF and DOCX files are allowed.\"}"
                                    )
                            }
                    )
            ),

            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "UploadFailure",
                                    summary = "General error during file upload",
                                    value = "{\"message\": \"File upload failed. Please try again.\"}"
                            )
                    )
            )
    })
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file")MultipartFile file,
                                        @AuthenticationPrincipal UserDetails userDetails) {

        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("File cannot be empty!"));
        }

        String type = file.getContentType();
        if (!"application/pdf".equals(type) &&
                !"application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(type)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Only PDF and DOCX files are allowed."));
        }
        try {
            DocumentResponse response = documentService.saveDocument(userDetails.getUsername(), file);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to process file. Please try again."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("File upload failed. Please try again."));
        }
    }

    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Retrieves Resumes",
                description = "Retrieves all the files uploaded by the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Files retrieved successfully",
                    content = @Content(schema = @Schema(implementation = DocumentResponse.class))),

            @ApiResponse(responseCode = "404", description = "No files found",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"No files found for this user.\"}"))),

            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"Failed to retrieve files.\"}")))
    })
    @GetMapping("/myfiles")
    public ResponseEntity<?> getUserFiles(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<DocumentResponse> files = documentService.getUserDocuments(userDetails.getUsername());

            if (files.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("No files found for this user."));
            }

            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to retrieve files."));
        }
    }

    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Downloads Resume",
                description = "Downloads file using it's ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File downloaded successfully"),

            @ApiResponse(responseCode = "404", description = "File not found",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"File not found.\"}"))),

            @ApiResponse(responseCode = "401", description = "Unauthorized access",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"Unauthorized access to file.\"}"))),

            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"Could not download file.\"}")))
    })
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            var file = documentService.getDocumentForUser(userDetails.getUsername(), id);

            if (file == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("File not found."));
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(file.getFiletype()))
                    .body(file.getData());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Unauthorized access to file."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Could not download file."));
        }
    }

    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Analyze Resume",
                description = "Analyzes the file using it's ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resume analyzed successfully",
                    content = @Content(schema = @Schema(implementation = JobResponse.class))),

            @ApiResponse(responseCode = "400", description = "Invalid input or file",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"Invalid job description.\"}"))),

            @ApiResponse(responseCode = "404", description = "Resume file not found",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"File not found.\"}"))),

            @ApiResponse(responseCode = "500", description = "Internal server error during analysis",
                    content = @Content(examples = @ExampleObject(value = "{\"message\": \"Failed to analyze resume.\"}")))
    })
    @PostMapping("/analyze/{id}")
    public ResponseEntity<?> analyzeFile(@PathVariable Long id,
                                         @RequestBody JobRequest jobRequest,
                                         @AuthenticationPrincipal UserDetails userDetails) {

        try {
            var file = documentService.getDocumentForUser(userDetails.getUsername(), id);

            if (file == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("File not found."));
            }

            String base64Resume = Base64.getEncoder().encodeToString(file.getData());

            JobResponse aiResponse = resumeService.callPythonAnalyzer(base64Resume, jobRequest);

            return ResponseEntity.ok(aiResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to analyze resume."));
        }

    }

}
