package com.project.erpre.controller;

import com.project.erpre.model.PriceDTO;
import com.project.erpre.service.PriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/price")
public class PriceController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private PriceService priceService;

    // [1] 🟢 가격 정보 삽입
    @PostMapping("/insert")
    public PriceDTO insertPrice(@RequestBody PriceDTO priceDTO) {
        logger.info("Inserting price: {}", priceDTO);
        return priceService.saveOrUpdate(priceDTO);  // DTO 전달 후 서비스에서 변환 및 저장
    }

    // [2] 🟢 가격 정보 수정
    @PutMapping("/update")
    public PriceDTO updatePrice(@RequestBody PriceDTO priceDTO) {
        logger.info("Updating price: {}", priceDTO);
        return priceService.saveOrUpdate(priceDTO);  // DTO 전달 후 서비스에서 변환 및 저장
    }

    // [3] 🟣 특정 가격 정보 삭제
    @DeleteMapping("/delete/{id}")
    public void deletePrice(@PathVariable("id") Integer priceNo) {
        logger.info("Deleting price with ID: {}", priceNo);
        priceService.deletePrice(priceNo);
    }

    // [4] 🔴 특정 가격 정보 조회
    @GetMapping("/find/{id}")
    public Optional<PriceDTO> getPriceById(@PathVariable("id") Integer priceNo) {
        logger.info("Fetching price with ID: {}", priceNo);
        return priceService.getPriceById(priceNo);
    }

    // [5] 🔴 가격 정보 목록 조회 (필터링, 페이징, 정렬 지원)
    @GetMapping("/all")
    public Page<PriceDTO> getAllPrices(
            @RequestParam(required = false) Integer customerNo,  // 고객 번호 필터
            @RequestParam(required = false) String productCd,    // 제품 코드 필터
            @RequestParam(required = false) String startDate,    // 시작 날짜 필터
            @RequestParam(required = false) String endDate,      // 종료 날짜 필터
            @RequestParam(required = false) String targetDate,   // 적용 대상 일
            @RequestParam(required = false) String searchText,   // 검색어 (고객사명 또는 상품명 필터)
            @RequestParam(required = false) String selectedStatus, // 상태 필터 (전체all/정상N/삭제Y)
            @RequestParam(defaultValue = "1") int page,          // 페이지 번호 (기본값: 1)
            @RequestParam(defaultValue = "10") int size,         // 페이지당 항목 수 (기본값: 10)
            @RequestParam(defaultValue = "priceNo") String sort, // 정렬 필드 (기본값: priceNo)
            @RequestParam(defaultValue = "asc") String order     // 정렬 순서 (기본값: asc)
    ) {
        logger.info("Fetching all prices with filters");
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(direction, sort));
        return priceService.getAllPrices(customerNo, productCd, startDate, endDate, targetDate, searchText, selectedStatus, pageRequest);
    }

    // [6] 🟡 특정 제품(Product)의 가격 정보 조회
    @GetMapping("/product/{productCd}")
    public List<PriceDTO> getPricesByProduct(@PathVariable("productCd") String productCd) {
        logger.info("Fetching prices for product with Code: {}", productCd);
        return priceService.getPricesByProduct(productCd);
    }

    // [7] 🟡 특정 고객(Customer)의 가격 정보 조회
    @GetMapping("/customer/{customerNo}")
    public List<PriceDTO> getPricesByCustomer(@PathVariable("customerNo") Integer customerNo) {
        logger.info("Fetching prices for customer with ID: {}", customerNo);
        return priceService.getPricesByCustomer(customerNo);
    }

    // [8] 🟡 특정 기간 내의 가격 정보 조회
    @GetMapping("/date-range")
    public List<PriceDTO> getPricesByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    ) {
        logger.info("Fetching prices between dates: {} and {}", startDate, endDate);
        return priceService.getPricesByDateRange(startDate, endDate);
    }
}
