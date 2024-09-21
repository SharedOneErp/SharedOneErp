package com.project.erpre.controller;

import com.project.erpre.service.OrderReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderReportController {

    @Autowired
    private OrderReportService orderReportService;
}
