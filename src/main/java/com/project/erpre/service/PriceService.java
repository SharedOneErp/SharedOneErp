package com.project.erpre.service;

import com.project.erpre.model.Price;
import com.project.erpre.repository.PriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PriceService {

    private static final Logger logger = LoggerFactory.getLogger(PriceService.class); // Logger 선언

    @Autowired
    private PriceRepository priceRepository;

    // [1],[2] 가격 정보 삽입 또는 수정
    public Price saveOrUpdate(Price price) {
        logger.info("[1],[2] Saving or updating price: " + price.toString());
        return priceRepository.save(price);
    }

    // [3] 가격 정보 삭제
    public void deletePrice(Integer priceNo) {
        logger.info("[3] Deleting price with ID: " + priceNo);
        priceRepository.deleteById(priceNo);
    }

    // [4] 특정 가격 정보 조회 (by priceNo)
    public Optional<Price> getPriceById(Integer priceNo) {
        logger.info("[4] Fetching price with ID: " + priceNo);
        return priceRepository.findById(priceNo);
    }

    // [5] 필터링 + 페이지네이션 + 정렬 🟥 🟥 🟥 🟥 🟥 🟥
    public Page<Price> getAllPrices(String customer, String product, String startDate, String endDate, PageRequest pageRequest) {
        if (customer != null || product != null || startDate != null || endDate != null) {
            logger.info("[5] Fetching all prices");
            // 필터링을 위한 동적 쿼리 실행
            return priceRepository.findPricesWithFilters(customer, product, startDate, endDate, pageRequest);
        }
        // 필터 없이 전체 조회
        return priceRepository.findAll(pageRequest);
    }

    // [6] 특정 제품(Product)의 가격 정보 조회
    public List<Price> getPricesByProduct(String productCd) {
        logger.info("[6] Fetching prices for product with Code: " + productCd);
        return priceRepository.findByProduct_ProductCd(productCd);
    }

    // [7] 특정 고객(Customer)의 가격 정보 조회
    public List<Price> getPricesByCustomer(Integer customerNo) {
        logger.info("[7] Fetching prices for customer with ID: " + customerNo);
        return priceRepository.findByCustomer_CustomerNo(customerNo);
    }

    // [8] 특정 기간 내의 가격 정보 조회
    public List<Price> getPricesByDateRange(String startDate, String endDate) {
        logger.info("[8] Fetching prices between dates: " + startDate + " and " + endDate);
        return priceRepository.findPricesByDateRange(startDate, endDate);
    }
}
