package com.project.erpre.service;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Price;
import com.project.erpre.model.Product;
import com.project.erpre.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceService {

    @Autowired
    private PriceRepository priceRepository;

    // 전체 가격 목록 조회
    public List<Price> getList() {
        return priceRepository.findAll();
    }

    // 고객과 제품에 따른 가격 정보 조회
    public List<Price> getDetail(Customer customer, Product product) {
        return priceRepository.findByCustomerAndProduct(customer, product);
    }

    // 가격 정보 삽입 또는 수정
    public Price saveOrUpdate(Price price) {
        return priceRepository.save(price);
    }

    // 가격 정보 삭제
    public void deletePrice(Integer priceNo) {
        priceRepository.deleteById(priceNo);
    }
}
