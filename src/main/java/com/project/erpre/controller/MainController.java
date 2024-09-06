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
        if (session.getAttribute("user") == null) {
            return "login";
        }
        return "redirect:/main";
    }


    @GetMapping("/{pageName}")
    public String page(@PathVariable String pageName, HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        if ("login".equals(pageName) && session.getAttribute("user") == null) {
            return "login";
        } else if ("main".equals(pageName) && session.getAttribute("user") != null) {
            model.addAttribute("user", user); // 사용자 정보를 모델에 추가
            model.addAttribute("pageName", pageName);
            return "view";
        }
        model.addAttribute("pageName", pageName);
        return "view";
    }
}


//package com.project.erpre.controller;
//
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//
//import javax.servlet.http.HttpSession;
//
//@Controller
//public class MainController {
//
//    @GetMapping("/")
//    public String redirectToMain() {
//        return "redirect:/main";
//    }
//
//    @GetMapping("/{pageName}") // .do 경로로 매핑
//    public String page(@PathVariable String pageName, Model model) {
//        model.addAttribute("pageName", pageName);
//        System.out.println("뷰 이름: " + pageName);
//
//        return "view"; // 항상 'view' 템플릿으로 이동 //test
//    }
//}

