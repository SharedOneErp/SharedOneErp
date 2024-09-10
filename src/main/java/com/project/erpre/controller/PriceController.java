package com.project.erpre.controller;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Price;
import com.project.erpre.model.Product;
import com.project.erpre.service.PriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/price")
//@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class PriceController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private PriceService priceService;

    // 전체 목록 조회
    @GetMapping("/getList")
    public List<Price> getList() {
        logger.info("[CUSTOM_LOG] test");
        return priceService.getList();
    }

    // 검색
    @GetMapping("/getDetail")
    public List<Price> getDetail(
            @RequestParam(required = false) Customer customer,
            @RequestParam(required = false) Product product
    ) {
        return priceService.getDetail(customer, product);
    }

    // 가격 정보 삽입 (INSERT)
    @PostMapping("/insert")
    public Price insertPrice(@RequestBody Price price) {
        return priceService.saveOrUpdate(price);
    }

    // 가격 정보 수정 (UPDATE)
    @PutMapping("/update")
    public Price updatePrice(@RequestBody Price price) {
        return priceService.saveOrUpdate(price);
    }

    // 가격 정보 삭제 (DELETE)
    @DeleteMapping("/delete/{priceNo}")
    public void deletePrice(@PathVariable Integer priceNo) {
        priceService.deletePrice(priceNo);
    }
}
