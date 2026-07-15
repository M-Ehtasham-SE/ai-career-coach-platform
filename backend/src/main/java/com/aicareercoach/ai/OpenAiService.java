package com.aicareercoach.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service that communicates with the OpenAI Chat Completions API.
 * Sends prompts and parses JSON responses.
 */
@Service
public class OpenAiService {

    private static final Logger log = LoggerFactory.getLogger(OpenAiService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.openai.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${app.openai.model:gpt-4o-mini}")
    private String model;

    @Value("${app.openai.api-key:}")
    private String apiKey;

    public OpenAiService(@Qualifier("openAiRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Returns true if the OpenAI API key is configured.
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Sends a prompt to OpenAI and returns the parsed JSON response content.
     * Uses response_format: json_object for structured output.
     */
    public JsonNode analyzeWithJson(String systemPrompt, String userPrompt) {
        if (!isConfigured()) {
            log.warn("OpenAI API key not configured — returning mock response");
            return generateMockResponse();
        }

        try {
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2000);
            requestBody.put("response_format", Map.of("type", "json_object"));

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));
            requestBody.put("messages", messages);

            String jsonRequest = objectMapper.writeValueAsString(requestBody);
            log.debug("OpenAI request: {}", jsonRequest.substring(0, Math.min(jsonRequest.length(), 200)));

            String rawResponse = restTemplate.postForObject(apiUrl, requestBody, String.class);
            JsonNode responseJson = objectMapper.readTree(rawResponse);

            // Extract the content from choices[0].message.content
            String content = responseJson
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText();

            log.debug("OpenAI response content: {}", content.substring(0, Math.min(content.length(), 200)));
            return objectMapper.readTree(content);

        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage(), e);
            return generateMockResponse();
        }
    }

    /**
     * Generates a mock AI response for development/testing when no API key is available.
     */
    private JsonNode generateMockResponse() {
        try {
            String mockJson = """
                {
                    "overallScore": 65,
                    "strengths": [
                        "Clear professional summary section",
                        "Relevant technical skills listed",
                        "Good use of action verbs",
                        "Education section is well-formatted",
                        "Contact information is complete"
                    ],
                    "weaknesses": [
                        "Lacks quantifiable achievements",
                        "Missing keywords for ATS optimization",
                        "Work experience descriptions are too generic",
                        "No portfolio or project links included",
                        "Skills section could be more organized"
                    ],
                    "suggestions": [
                        "Add metrics to your accomplishments (e.g., 'Increased sales by 25%')",
                        "Include a link to your GitHub profile or portfolio website",
                        "Tailor your skills section to match the target job description",
                        "Add a 'Projects' section to showcase relevant work",
                        "Use industry-specific keywords to improve ATS compatibility"
                    ]
                }
                """;
            return objectMapper.readTree(mockJson);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate mock response", e);
        }
    }
}
