package com.screen.resume_screener.Service;

import com.screen.resume_screener.dto.JobRequest;
import com.screen.resume_screener.dto.JobResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public JobResponse callPythonAnalyzer(String base64Resume, JobRequest jobRequest) {

        RestTemplate restTemplate = new RestTemplate();

        HashMap<String, Object> request = new HashMap<>();
        request.put("resume", base64Resume);
        request.put("job_title", jobRequest.getJobTitle());
        request.put("job_description", jobRequest.getJobDescription());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request,httpHeaders);

        ResponseEntity<JobResponse> response = restTemplate.postForEntity(
                aiServiceUrl + "/analyze-resume", entity, JobResponse.class
        );

        return response.getBody();

    }

}
