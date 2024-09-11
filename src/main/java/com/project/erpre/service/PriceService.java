package com.project.erpre.service;

import com.project.erpre.model.Price;
import com.project.erpre.model.PriceDTO;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.PriceRepository;
import com.project.erpre.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class PriceService {

    private static final Logger logger = LoggerFactory.getLogger(PriceService.class); // Logger 선언

    @Autowired
    private PriceRepository priceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    // Price 엔티티를 PriceDTO로 변환하는 메서드
    private PriceDTO convertToDTO(Price price) {
        PriceDTO dto = new PriceDTO();
        dto.setPriceNo(price.getPriceNo());
        dto.setCustomerNo(price.getCustomer().getCustomerNo());
        dto.setCustomerName(price.getCustomer().getCustomerName()); // 고객 이름 설정
        dto.setProductCd(price.getProduct().getProductCd());
        dto.setProductNm(price.getProduct().getProductNm()); // 제품 이름 설정
        dto.setCategoryNm(price.getProduct().getCategory().getCategoryNm()); // 카테고리 이름 설정
        dto.setPriceCustomer(price.getPriceCustomer());
        dto.setPriceStartDate(price.getPriceStartDate());
        dto.setPriceEndDate(price.getPriceEndDate());
        dto.setPriceInsertDate(price.getPriceInsertDate());
        dto.setPriceUpdateDate(price.getPriceUpdateDate());
        return dto;
    }

    // PriceDTO를 Price 엔티티로 변환하는 메서드
    public Price convertToEntity(PriceDTO priceDTO) {
        Price price = new Price();

        // PriceDTO의 값을 Price 엔티티에 설정
        price.setPriceNo(priceDTO.getPriceNo()); // 가격 번호 설정
        price.setPriceCustomer(priceDTO.getPriceCustomer()); // 고객별 가격 설정
        price.setPriceStartDate(priceDTO.getPriceStartDate()); // 가격 적용 시작 일자 설정
        price.setPriceEndDate(priceDTO.getPriceEndDate()); // 가격 적용 종료 일자 설정
        price.setPriceInsertDate(priceDTO.getPriceInsertDate()); // 가격 등록 일시 설정
        price.setPriceUpdateDate(priceDTO.getPriceUpdateDate()); // 가격 수정 일시 설정

        // 고객과 제품 정보는 외래 키로 설정된 엔티티에서 가져옴
        price.setCustomer(customerRepository.findById(priceDTO.getCustomerNo())
                .orElseThrow(() -> new RuntimeException("고객을 찾을 수 없습니다: " + priceDTO.getCustomerNo())));
        price.setProduct(productRepository.findById(priceDTO.getProductCd())
                .orElseThrow(() -> new RuntimeException("제품을 찾을 수 없습니다: " + priceDTO.getProductCd())));

        return price;
    }

    // [1] 가격 정보를 저장하거나 수정하는 메서드 (PriceDTO로 변환하여 반환)
    public PriceDTO saveOrUpdate(Price price) {
        logger.info("[1],[2] Saving or updating price: " + price.toString());
        Price savedPrice = priceRepository.save(price);
        return convertToDTO(savedPrice);
    }

    // [2] 가격 정보 삭제
    public void deletePrice(Integer priceNo) {
        logger.info("[3] Deleting price with ID: " + priceNo);
        priceRepository.deleteById(priceNo);
    }

    // [3] 특정 가격 정보 조회
    public Optional<PriceDTO> getPriceById(Integer priceNo) {
        logger.info("[4] Fetching price with ID: " + priceNo);
        Optional<Price> priceOpt = priceRepository.findById(priceNo);
        return priceOpt.map(this::convertToDTO); // Optional 처리 및 DTO 변환
    }

    // [4] 필터링 + 페이지네이션 + 정렬 처리 (Price 엔티티를 PriceDTO로 변환하여 반환) 🟥
    public Page<PriceDTO> getAllPrices(Integer customerNo, String productCd, String startDate, String endDate, PageRequest pageRequest) {
        logger.info("[5] Fetching all prices with filters");

        // 필터가 하나라도 존재하면 필터링된 가격 정보를 조회
        if (customerNo != null || productCd != null || startDate != null || endDate != null) {
            Page<Price> prices = priceRepository.findPricesWithFilters(customerNo, productCd, startDate, endDate, pageRequest);
            return prices.map(this::convertToDTO); // 엔티티를 DTO로 변환 후 반환
        }

        // 필터가 없으면 전체 가격 정보를 조회
        Page<Price> allPrices = priceRepository.findAll(pageRequest);
        return allPrices.map(this::convertToDTO); // 엔티티를 DTO로 변환 후 반환
    }

    // [5] 특정 제품의 가격 정보 조회 (PriceDTO 리스트로 변환)
    public List<PriceDTO> getPricesByProduct(String productCd) {
        logger.info("[6] Fetching prices for product with Code: " + productCd);
        List<Price> prices = priceRepository.findByProduct_ProductCd(productCd);
        return prices.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // [6] 특정 고객의 가격 정보 조회 (PriceDTO 리스트로 변환)
    public List<PriceDTO> getPricesByCustomer(Integer customerNo) {
        logger.info("[7] Fetching prices for customer with ID: " + customerNo);
        List<Price> prices = priceRepository.findByCustomer_CustomerNo(customerNo);
        return prices.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // [7] 특정 기간 내의 가격 정보 조회 (PriceDTO로 변환하여 반환)
    public List<PriceDTO> getPricesByDateRange(String startDate, String endDate) {
        logger.info("[8] Fetching prices between dates: " + startDate + " and " + endDate);
        List<Price> prices = priceRepository.findPricesByDateRange(startDate, endDate);
        return prices.stream()
                .map(this::convertToDTO)  // 엔티티를 DTO로 변환
                .collect(Collectors.toList());  // 리스트로 변환하여 반환
    }

}
