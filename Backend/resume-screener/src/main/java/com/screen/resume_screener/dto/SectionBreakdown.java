package com.screen.resume_screener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class SectionBreakdown {

    @Schema(description = "Section Score", example = "20")
    private double score;

    @Schema(description = "Maximum Section Score Possible", example = "25")
    private double outOf;

    @Schema(description = "Section Comment", example = "User has ...")
    private String comment;

    public SectionBreakdown() {}

    public SectionBreakdown(double score, String comment, double outOf) {
        this.score = score;
        this.comment = comment;
        this.outOf = outOf;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setOutOf(double outOf) {
        this.outOf = outOf;
    }

    public double getOutOf() {
        return outOf;
    }
}
