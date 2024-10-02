package com.project.erpre.service;

import com.project.erpre.model.Price;
import com.project.erpre.model.PriceDTO;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.PriceRepository;
import com.project.erpre.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.sql.Timestamp;

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

    @Autowired
    private ModelMapper modelMapper;  // ModelMapper 객체 주입

    // 엔티티 -> DTO 변환(ModelMapper 라이브러리 사용x)
    public PriceDTO convertToDTO(Price price) {
        PriceDTO dto = new PriceDTO();
        // 필드 수동 매핑
        dto.setPriceNo(price.getPriceNo());
        dto.setPriceCustomer(price.getPriceCustomer());
        dto.setPriceStartDate(price.getPriceStartDate());
        dto.setPriceEndDate(price.getPriceEndDate());
        dto.setCustomerNo(price.getCustomer().getCustomerNo());
        dto.setProductCd(price.getProduct().getProductCd());
        dto.setCustomerName(price.getCustomer().getCustomerName());
        dto.setProductNm(price.getProduct().getProductNm());
        dto.setCategoryNm(price.getProduct().getCategory().getCategoryNm());
        dto.setCategoryPath(price.getProduct().getCategory().getCategoryPath());
        dto.setPriceInsertDate(price.getPriceInsertDate());
        dto.setPriceUpdateDate(price.getPriceUpdateDate());
        dto.setPriceDeleteYn(price.getPriceDeleteYn());
        dto.setPriceDeleteDate(price.getPriceDeleteDate());

        return dto;
    }

    // DTO -> 엔티티 변환(ModelMapper 라이브러리 사용x)
    public Price convertToEntity(PriceDTO priceDTO) {
        Price price = new Price();
        price.setPriceNo(priceDTO.getPriceNo());
        price.setPriceCustomer(priceDTO.getPriceCustomer());
        price.setPriceStartDate(priceDTO.getPriceStartDate());
        price.setPriceEndDate(priceDTO.getPriceEndDate());
        price.setPriceDeleteYn(priceDTO.getPriceDeleteYn());
        price.setPriceInsertDate(priceDTO.getPriceInsertDate());
        price.setPriceUpdateDate(priceDTO.getPriceUpdateDate());
        price.setPriceDeleteDate(priceDTO.getPriceDeleteDate());

        // 수동으로 연관 엔티티 매핑
        price.setCustomer(customerRepository.findById(priceDTO.getCustomerNo())
                .orElseThrow(() -> new RuntimeException("고객을 찾을 수 없습니다: " + priceDTO.getCustomerNo())));
        price.setProduct(productRepository.findById(priceDTO.getProductCd())
                .orElseThrow(() -> new RuntimeException("제품을 찾을 수 없습니다: " + priceDTO.getProductCd())));

        return price;
    }

    // 🟢 가격 정보를 저장하거나 수정하는 메서드 (여러 개의 PriceDTO 처리)
    public List<PriceDTO> saveOrUpdate(List<PriceDTO> priceDTOs) {
        // 로그로 PriceDTO 목록 출력
        logger.info("[1] 🟢 Received PriceDTO List for saving or updating: {}", priceDTOs);

        // 각 PriceDTO에 대해 엔티티 변환 및 저장
        List<PriceDTO> savedPriceDTOs = priceDTOs.stream().map(priceDTO -> {
            logger.info("🟢 Saving or updating price: {}", priceDTO); // 각 PriceDTO 로그 출력
            Price price = convertToEntity(priceDTO); // DTO -> 엔티티 변환

            // priceNo가 존재하는 경우(수정 모드) 수정일시를 현재 시간으로 설정
            if (price.getPriceNo() != null) {
                price.setPriceUpdateDate(new Timestamp(System.currentTimeMillis())); // 수정 모드일 때 수정일시 업데이트
            }

            Price savedPrice = priceRepository.save(price); // 엔티티 저장
            return convertToDTO(savedPrice); // 저장 후 DTO로 반환
        }).collect(Collectors.toList());

        return savedPriceDTOs; // 저장된 PriceDTO 리스트 반환
    }

    // 🟢 가격 정보 삭제/복원
    public List<Price> updatePriceDeleteYn(List<PriceDTO> priceDTOs) {
        List<Price> updatedPrices = new ArrayList<>();

        // 각 PriceDTO를 처리
        for (PriceDTO priceDTO : priceDTOs) {
            // priceNo로 기존 Price 엔티티를 조회
            Price price = priceRepository.findById(priceDTO.getPriceNo())
                    .orElseThrow(() -> new RuntimeException("가격 정보를 찾을 수 없습니다: " + priceDTO.getPriceNo()));

            // 삭제 여부에 따라 삭제일시 및 수정일시 처리
            if ("Y".equals(priceDTO.getPriceDeleteYn())) {
                price.setPriceDeleteYn("Y");
                price.setPriceDeleteDate(new Timestamp(System.currentTimeMillis()));  // 삭제일시 업데이트
            } else if ("N".equals(priceDTO.getPriceDeleteYn())) {
                price.setPriceDeleteYn("N");
                price.setPriceDeleteDate(null);  // 삭제일시를 null로 설정
                price.setPriceUpdateDate(new Timestamp(System.currentTimeMillis())); // 수정 일시 업데이트
            }
            // 변경된 엔티티를 저장 (업데이트)
            updatedPrices.add(priceRepository.save(price));
        }

        // 업데이트된 Price 엔티티 리스트 반환
        return updatedPrices;
    }


    // 🟣 가격 정보 삭제
    public void deletePrice(Integer priceNo) {
        logger.info("[3] Deleting price with ID: " + priceNo);
        priceRepository.deleteById(priceNo);
    }

    // 🔴 특정 고객과 특정 제품의 가격 정보 조회
    public List<PriceDTO> getPricesByCustomerAndProduct(Integer customerNo, String productCd) {
        List<Price> prices = priceRepository.findByCustomer_CustomerNoAndProduct_ProductCd(customerNo, productCd);
        return prices.stream()
                .map(this::convertToDTO)  // Price -> PriceDTO 변환
                .collect(Collectors.toList());
    }

    // 🟢 중복 가격 정보 확인 메서드
    public List<PriceDTO> checkDuplicate(PriceDTO priceDTO) {
        logger.info("🟢 Checking for duplicate price for customerNo: {}, productCd: {}, priceStartDate: {}, priceEndDate: {}",
                priceDTO.getCustomerNo(), priceDTO.getProductCd(), priceDTO.getPriceStartDate(), priceDTO.getPriceEndDate());

        // 중복되는 가격 정보 조회
        List<Price> overlappingPrices = priceRepository.findOverlappingPrices(
                priceDTO.getCustomerNo(),
                priceDTO.getProductCd(),
                priceDTO.getPriceStartDate(),
                priceDTO.getPriceEndDate());

        // Price 엔티티를 PriceDTO로 변환하여 반환
        return overlappingPrices.stream()
                .map(this::convertToDTO) // 엔티티를 DTO로 변환
                .collect(Collectors.toList()); // 리스트로 반환
    }

    // 🔴 필터링 + 페이지네이션 + 정렬 처리 (Price 엔티티를 PriceDTO로 변환하여 반환)
    public Page<PriceDTO> getAllPrices(Integer customerNo, String productCd, String startDate, String endDate, String targetDate, String customerSearchText, String productSearchText, String selectedStatus, PageRequest pageRequest) {
        logger.info("🟢 Fetching all prices with filters");

        // 필터 조건이 하나라도 존재할 경우 필터링된 가격 정보를 조회
        if (customerNo != null || productCd != null || startDate != null || endDate != null || customerSearchText != null || productSearchText != null || selectedStatus != null) {
            // 리포지토리에서 필터링된 데이터를 가져옴
            Page<Price> prices = priceRepository.findPricesWithFilters(customerNo, productCd, startDate, endDate, targetDate, customerSearchText, productSearchText, selectedStatus, pageRequest);
            return prices.map(this::convertToDTO); // 엔티티를 DTO로 변환하여 반환
        }

        // 필터가 없으면 전체 가격 정보를 조회
        Page<Price> allPrices = priceRepository.findAll(pageRequest);
        return allPrices.map(this::convertToDTO); // 엔티티를 DTO로 변환 후 반환
    }

}
