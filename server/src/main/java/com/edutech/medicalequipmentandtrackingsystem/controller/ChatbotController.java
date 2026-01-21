// package com.edutech.medicalequipmentandtrackingsystem.controller;

// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.edutech.medicalequipmentandtrackingsystem.service.ChatbotService;

// @RestController
// @RequestMapping("/api/chatbot")
// @CrossOrigin(origins = "*")
// public class ChatbotController {

//     @Autowired
//     private ChatbotService chatbotService;

//     @PostMapping("/chat")
//     public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
//         try {
//             if (!body.containsKey("message") || body.get("message").trim().isEmpty()) {
//                 return ResponseEntity.badRequest()
//                         .body(Map.of("error", "Message is required"));
//             }

//             String reply = chatbotService.chat(body.get("message"));

//             return ResponseEntity.ok(
//                     Map.of("reply", reply)
//             );
//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.status(500)
//                     .body(Map.of("error", "Internal server error: " + e.getMessage()));
//         }
//     }
// }