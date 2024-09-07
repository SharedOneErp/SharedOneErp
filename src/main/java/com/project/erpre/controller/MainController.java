package com.project.erpre.controller;

import com.project.erpre.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpSession;

@Controller
public class MainController {


    @GetMapping("/")
    public String home(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "login";
        }
        return "redirect:/main";
    }

    @GetMapping("/login")
    public String login(HttpSession session) {
        if (session.getAttribute("user") != null) {
            return "redirect:/main";
        }
        return "login";
    }

    @GetMapping("/{pageName}")
    public String page(@PathVariable String pageName, HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        if ("main".equals(pageName) && user != null) {
            model.addAttribute("user", user);
            return "view";
        } else if ("login".equals(pageName) && user == null) {
            return "login";
        }
        // 페이지가 로그인 또는 메인 페이지가 아닌 경우에 대해 처리
        return "view";
    }
}
