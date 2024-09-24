package com.project.erpre.controller;

import com.project.erpre.model.Price;
import com.project.erpre.model.PriceDTO;
import com.project.erpre.service.PriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
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

    // 🟢 가격 정보 삽입
    @PostMapping("/insert")
    public List<PriceDTO> insertPrice(@RequestBody List<PriceDTO> priceDTOs) {
        logger.info("🟢 insertPrice : Received PriceDTO List: {}", priceDTOs);  // priceDTOs 자체를 로그로 출력
        return priceService.saveOrUpdate(priceDTOs);
    }

    // 🟢 가격 정보 수정
    @PutMapping("/update")
    public List<PriceDTO> updatePrice(@RequestBody List<PriceDTO> priceDTOs) {
        logger.info("🟢 updatePrice : Received PriceDTO List: {}", priceDTOs);  // priceDTOs 자체를 로그로 출력
        return priceService.saveOrUpdate(priceDTOs);
    }

    // 🟢 가격 정보 삭제 및 복원
    @PutMapping("/updateDel")
    public ResponseEntity<List<Price>> updatePriceDeleteYn(@RequestBody List<PriceDTO> priceDTOs) {
        logger.info("🟢 Received PriceDTO List: {}", priceDTOs);  // priceDTOs 로그 출력
        List<Price> updatedPrices = priceService.updatePriceDeleteYn(priceDTOs);
        return ResponseEntity.ok(updatedPrices);  // 업데이트된 Price 리스트 반환
    }

    // [3] 🟣 특정 가격 정보 삭제
    @DeleteMapping("/delete/{id}")
    public void deletePrice(@PathVariable("id") Integer priceNo) {
        logger.info("Deleting price with ID: {}", priceNo);
        priceService.deletePrice(priceNo);
    }

    // 🔴 특정 고객과 제품의 가격 정보 조회
    @GetMapping("/customer-product")
    public List<PriceDTO> getPricesByCustomerAndProduct(
            @RequestParam("customerNo") Integer customerNo,
            @RequestParam("productCd") String productCd
    ) {
        logger.info("Fetching prices for customer {} and product {}", customerNo, productCd);
        return priceService.getPricesByCustomerAndProduct(customerNo, productCd);
    }

    // 🔴 가격의 시작일과 종료일이 겹치는지 확인하는 API
    @PostMapping("/check-duplicate")
    public ResponseEntity<List<PriceDTO>> checkDuplicatePrice(@RequestBody PriceDTO priceDTO) {
        logger.info("🟢 Received PriceDTO: {}", priceDTO);  // priceDTO 로그 출력

        // 겹치는 데이터가 있는지 서비스에서 확인
        List<PriceDTO> duplicatePrices = priceService.checkDuplicate(priceDTO);

        // 중복 가격 정보를 반환 (없으면 빈 리스트 반환)
        return ResponseEntity.ok(duplicatePrices);
    }

    // 🔴 가격 정보 목록 조회 (필터링, 페이징, 정렬 지원)
    @GetMapping("/all")
    public Page<PriceDTO> getAllPrices(
            @RequestParam(required = false) Integer customerNo,  // 고객 번호 필터
            @RequestParam(required = false) String productCd,    // 제품 코드 필터
            @RequestParam(required = false) String startDate,    // 시작 날짜 필터
            @RequestParam(required = false) String endDate,      // 종료 날짜 필터
            @RequestParam(required = false) String targetDate,   // 적용 대상 일
            @RequestParam(required = false) String customerSearchText,   // 검색어 (고객사명)
            @RequestParam(required = false) String productSearchText,   // 검색어 (상품명 또는 상품코드)
            @RequestParam(required = false) String selectedStatus, // 상태 필터 (전체all/정상N/삭제Y)
            @RequestParam(defaultValue = "1") int page,          // 페이지 번호 (기본값: 1)
            @RequestParam(defaultValue = "10") int size,         // 페이지당 항목 수 (기본값: 10)
            @RequestParam(defaultValue = "priceNo") String sort, // 정렬 필드 (기본값: priceNo)
            @RequestParam(defaultValue = "asc") String order     // 정렬 순서 (기본값: asc)
    ) {
        logger.info("Fetching all prices with filters");
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(direction, sort));
        return priceService.getAllPrices(customerNo, productCd, startDate, endDate, targetDate, customerSearchText, productSearchText, selectedStatus, pageRequest);
    }
}
