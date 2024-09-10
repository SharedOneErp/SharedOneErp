package com.project.erpre.controller;

import com.project.erpre.model.Price;
import com.project.erpre.service.PriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/price")
public class PriceController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private PriceService priceService;

    // [1] 가격 정보 삽입 (INSERT)
    @PostMapping("/insert")
    public Price insertPrice(@RequestBody Price price) {
        logger.info("[1] Inserting price: " + price.toString());
        return priceService.saveOrUpdate(price);  // [1],[2] 매핑
    }

    // [2] 가격 정보 수정 (UPDATE)
    @PutMapping("/update")
    public Price updatePrice(@RequestBody Price price) {
        logger.info("[2] Updating price: " + price.toString());
        return priceService.saveOrUpdate(price);  // [1],[2] 매핑
    }

    // [3] 가격 정보 삭제 (DELETE)
    @DeleteMapping("/delete/{priceNo}")
    public void deletePrice(@PathVariable Integer priceNo) {
        logger.info("[3] Deleting price with ID: " + priceNo);
        priceService.deletePrice(priceNo);  // [3] 매핑
    }

    // [4] 특정 가격 정보 조회 (READ by priceNo)
    @GetMapping("/get/{priceNo}")
    public Optional<Price> getPriceById(@PathVariable Integer priceNo) {
        logger.info("[4] Fetching price with ID: " + priceNo);
        return priceService.getPriceById(priceNo);  // [4] 매핑
    }

    // [5] 모든 가격 정보 조회 + 필터링 + 페이지네이션 + 정렬 🟥🟥🟥🟥🟥🟥🟥🟥
    @GetMapping("/all")
    public Page<Price> getAllPrices(
            @RequestParam(required = false) String customer,
            @RequestParam(required = false) String product,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "priceNo") String sort,
            @RequestParam(defaultValue = "asc") String order) {
        logger.info("[5] Fetching all prices");

        // 정렬 방향 설정
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sort));

        // 서비스에서 필터링과 페이지네이션을 처리
        return priceService.getAllPrices(customer, product, startDate, endDate, pageRequest);
    }

    // [6] 특정 제품(Product)의 가격 정보 조회
    @GetMapping("/product/{productCd}")
    public List<Price> getPricesByProduct(@PathVariable String productCd) {
        logger.info("[6] Fetching prices for product with Code: " + productCd);
        return priceService.getPricesByProduct(productCd);  // [6] 매핑
    }

    // [7] 특정 고객(Customer)의 가격 정보 조회
    @GetMapping("/customer/{customerNo}")
    public List<Price> getPricesByCustomer(@PathVariable Integer customerNo) {
        logger.info("[7] Fetching prices for customer with ID: " + customerNo);
        return priceService.getPricesByCustomer(customerNo);  // [7] 매핑
    }

    // [8] 특정 기간 내의 가격 정보 조회
    @GetMapping("/date-range")
    public List<Price> getPricesByDateRange(@RequestParam String startDate, @RequestParam String endDate) {
        logger.info("[8] Fetching prices between dates: " + startDate + " and " + endDate);
        return priceService.getPricesByDateRange(startDate, endDate);  // [8] 매핑
    }
}
