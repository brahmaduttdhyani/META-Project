
package com.edutech.medicalequipmentandtrackingsystem.service.serviceImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.edutech.medicalequipmentandtrackingsystem.service.ChatbotService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final WebClient webClient;

    @Value("${groq.api.key}")
    private String apiKey;

    public ChatbotServiceImpl(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://api.groq.com")
                .build();
    }

    @Override
    public String chat(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            throw new RuntimeException("Message cannot be empty");
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.1-8b-instant");
        requestBody.put("messages", List.of(
            Map.of(
                "role", "system",
                "content",
                // === UI-based, user-friendly help, in-scope only ===
                "You are a concise helper for the Medical Equipment & Tracking System. " +
                "Speak in short, user-friendly steps that tell people where to click in the UI. " +
                "Prefer UI paths like: 'Dashboard → Create Hospital', 'Dashboard → Equipment → Add', " +
                "'Dashboard → Maintenance → Schedule', 'Dashboard → Orders → Create', 'Login / Registration pages'. " +
                "Keep answers compact, use simple bullets, and avoid technical API details unless the user asks for them. " +
                "If asked anything outside this product scope, reply exactly once: " +
                "'Sorry, I’m only a tracker bot. That’s out of scope.'"
            ),
            Map.of("role", "user", "content", userMessage)
        ));

        try {
            Map<?, ?> response = webClient.post()
                    .uri("/openai/v1/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || !response.containsKey("choices")) {
                return "I’m having trouble processing your request right now. Please try again later.";
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");

            if (choices == null || choices.isEmpty()) {
                return "I’m having trouble processing your request right now. Please try again later.";
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

            if (message == null || !message.containsKey("content")) {
                return "I’m having trouble processing your request right now. Please try again later.";
            }

            return String.valueOf(message.get("content"));
        } catch (Exception e) {
            e.printStackTrace();
            return "I’m having trouble processing your request right now. Please try again later.";
        }
    }
}
