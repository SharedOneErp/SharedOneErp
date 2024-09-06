package com.project.erpre.controller;

import com.project.erpre.model.User;
import com.project.erpre.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        User user = userRepository.findByUsernameAndPassword(username, password).orElse(null);

        if (user != null) {
            session.setAttribute("user", user);
            return ResponseEntity.ok(Map.of("message", "로그인 성공", "token", "your_jwt_token_here"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다."));
        }
    }


        @PostMapping("/logout")
        public ResponseEntity<?> logout(HttpSession session) {
            session.invalidate(); // 세션 무효화
            return ResponseEntity.ok().build(); // 성공적으로 로그아웃
        }

    @GetMapping("/user")
    public ResponseEntity<User> getUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized if no user is found
        }
    }
}



