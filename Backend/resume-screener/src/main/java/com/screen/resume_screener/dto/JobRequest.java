package com.screen.resume_screener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class JobRequest {

    @Schema(description = "Job Title", example = "Software Engineer III")
    private String jobTitle;

    @Schema(description = "Job Description",
            example = "Minimum Qualification, Education Requirements, etc.")
    private String jobDescription;

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobTitle() {
        return jobTitle;
    }
}
