package com.project.erpre.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MainController {

    @GetMapping("/{pageName}.do") // .do 경로로 매핑
    public String page(@PathVariable String pageName, Model model) {
        model.addAttribute("pageName", pageName);
        System.out.println("뷰 이름: " + pageName);
        return "view"; // 항상 'view' 템플릿으로 이동
    }
}