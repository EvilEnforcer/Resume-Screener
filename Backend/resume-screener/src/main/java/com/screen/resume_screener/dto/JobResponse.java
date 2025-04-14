package com.screen.resume_screener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Map;

public class JobResponse {

    @Schema(description = "Resume Score", example = "78")
    private int score;

    @Schema(description = "Analysis Summary", example = "User has a well developed ...")
    private String summary;

    @Schema(description = "Analysis Sections", example = "Education, Projects, etc.")
    private Map<String, SectionBreakdown> sections;

    public JobResponse( int score,
                        String summary,
                        Map<String, SectionBreakdown> sections) {

        this.score = score;
        this.summary = summary;
        this.sections = sections;

    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getScore() {
        return score;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSummary() {
        return summary;
    }

    public void setSections(Map<String, SectionBreakdown> sections) {
        this.sections = sections;
    }

    public Map<String, SectionBreakdown> getSections() {
        return sections;
    }
}
