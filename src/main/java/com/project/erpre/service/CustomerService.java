package com.project.erpre.service;

import com.project.erpre.model.Customer;
import com.project.erpre.model.CustomerDTO;
import com.project.erpre.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // CustomerDTO -> Customer 엔티티로 변환하는 메서드
    private Customer convertToEntity(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setCustomerNo(customerDTO.getCustomerNo());
        customer.setCustomerName(customerDTO.getCustomerName());
        customer.setCustomerTel(customerDTO.getCustomerTel());
        customer.setCustomerRepresentativeName(customerDTO.getCustomerRepresentativeName());
        customer.setCustomerBusinessRegNo(customerDTO.getCustomerBusinessRegNo());
        customer.setCustomerAddr(customerDTO.getCustomerAddr());
        customer.setCustomerFaxNo(customerDTO.getCustomerFaxNo());
        customer.setCustomerManagerName(customerDTO.getCustomerManagerName());
        customer.setCustomerManagerEmail(customerDTO.getCustomerManagerEmail());
        customer.setCustomerManagerTel(customerDTO.getCustomerManagerTel());
        customer.setCustomerCountryCode(customerDTO.getCustomerCountryCode());
        customer.setCustomerType(customerDTO.getCustomerType());
        customer.setCustomerEtaxInvoiceYn(customerDTO.getCustomerEtaxInvoiceYn());
        //customer.setPrices(customerDTO.getPrices()); 오류
        return customer;
    }

    // Customer 엔티티 -> CustomerDTO로 변환하는 메서드
    private CustomerDTO convertToDTO(Customer customer) {
        return CustomerDTO.builder()
                .customerNo(customer.getCustomerNo())
                .customerName(customer.getCustomerName())
                .customerTel(customer.getCustomerTel())
                .customerRepresentativeName(customer.getCustomerRepresentativeName())
                .customerBusinessRegNo(customer.getCustomerBusinessRegNo())
                .customerAddr(customer.getCustomerAddr())
                .customerFaxNo(customer.getCustomerFaxNo())
                .customerManagerName(customer.getCustomerManagerName())
                .customerManagerEmail(customer.getCustomerManagerEmail())
                .customerManagerTel(customer.getCustomerManagerTel())
                .customerCountryCode(customer.getCustomerCountryCode())
                .customerType(customer.getCustomerType())
                .customerEtaxInvoiceYn(customer.getCustomerEtaxInvoiceYn())
                //.prices(customer.getPrices()) 오류
                .build();
    }

    // 전체 고객 목록 조회
    public List<Customer> getList() {
        return customerRepository.findAll();
    }

    //전체 고객사, 삭제된 고객사 목록 조회
    public List<Customer> getCustomersByDeleteYn(String deleteYn) {
        if (deleteYn == null) {
            return customerRepository.findAll(); // 전체 고객 조회
        } else {
            return customerRepository.findByCustomerDeleteYn(deleteYn); // deleteYn 값에 따라 필터링
        }
    }

    // 고객 등록
    public Customer insertCustomer(Customer customer) {
        customer.setCustomerDeleteYn("N"); // 기본값 N
        customer.setCustomerInsertDate(new Timestamp(System.currentTimeMillis())); //등록일시 기록
        return customerRepository.save(customer); //등록 여부 저장
    }

    // 고객 정보 수정
    public Customer updateCustomer(Integer customerNo, Customer updatedCustomer) {
        Optional<Customer> existingCustomerOptional = customerRepository.findById(customerNo);
        if (existingCustomerOptional.isPresent()) {
            Customer existingCustomer = existingCustomerOptional.get();

            // 수정할 필드 적용
            existingCustomer.setCustomerName(updatedCustomer.getCustomerName());
            existingCustomer.setCustomerTel(updatedCustomer.getCustomerTel());
            existingCustomer.setCustomerRepresentativeName(updatedCustomer.getCustomerRepresentativeName());
            existingCustomer.setCustomerBusinessRegNo(updatedCustomer.getCustomerBusinessRegNo());
            existingCustomer.setCustomerAddr(updatedCustomer.getCustomerAddr());
            existingCustomer.setCustomerFaxNo(updatedCustomer.getCustomerFaxNo());
            existingCustomer.setCustomerManagerName(updatedCustomer.getCustomerManagerName());
            existingCustomer.setCustomerManagerEmail(updatedCustomer.getCustomerManagerEmail());
            existingCustomer.setCustomerManagerTel(updatedCustomer.getCustomerManagerTel());
            existingCustomer.setCustomerCountryCode(updatedCustomer.getCustomerCountryCode());
            existingCustomer.setCustomerType(updatedCustomer.getCustomerType());
            existingCustomer.setCustomerEtaxInvoiceYn(updatedCustomer.getCustomerEtaxInvoiceYn());
            existingCustomer.setCustomerTransactionStartDate(updatedCustomer.getCustomerTransactionStartDate());
            existingCustomer.setCustomerTransactionEndDate(updatedCustomer.getCustomerTransactionEndDate());

            existingCustomer.setCustomerUpdateDate(new Timestamp(System.currentTimeMillis())); //수정 일시 기록
            return customerRepository.save(existingCustomer); // 수정 후 저장
        } else {
            throw new RuntimeException("Customer not found with customerNo: " + customerNo);
        }
    }

    // 고객 삭제
    public void deleteCustomer(Integer customerNo) {
        Optional<Customer> existingCustomerOptional = customerRepository.findById(customerNo);
        if (existingCustomerOptional.isPresent()) {
            Customer customer = existingCustomerOptional.get();
            customer.setCustomerDeleteYn("Y");
            customer.setCustomerDeleteDate(new Timestamp(System.currentTimeMillis())); // 삭제일시 기록
            customerRepository.save(customer); // 삭제 여부 저장
        } else {
            throw new RuntimeException("Customer not found with customerNo: " + customerNo);
        }
    }

    //고객 이름 검색
    public List<Customer> searchCustomers(String name) {
        return customerRepository.findByCustomerNameContainingIgnoreCase(name);
    }

    // 메인 - 총 고객사 수 (삭제안된거)
    public Long getTotalCustomer() {
        return customerRepository.countByCustomerDeleteYn("N");
    }

    // 메인 - 최근 신규 고객 (등록일시가 오늘부터 3일 전까지)
    public List<Customer> getRecentCustomer() {
        Timestamp threeDaysAgo = new Timestamp(System.currentTimeMillis() - 3L * 24 * 60 * 60 * 1000);
        return customerRepository.findByCustomerInsertDateAfterAndCustomerDeleteYn(threeDaysAgo, "N");
    }

    // 메인 - 계약 갱신 예정 (transactionEndDate가 오늘 기준 3일 남은 것)
    public List<Customer> getRenewalCustomer() {
        Timestamp today = new Timestamp(System.currentTimeMillis());
        Timestamp targetDate = new Timestamp(today.getTime() + 3L * 24 * 60 * 60 * 1000);
        return customerRepository.findByCustomerTransactionEndDateBetweenAndCustomerDeleteYn(today, targetDate, "N");
    }

    //유효성 검사
    public boolean isDuplicateCustomerName(String customerName) {
        return customerRepository.existsByCustomerName(customerName);
    }
    public boolean isDuplicateBusinessRegNo(String customerBusinessRegNo) {
        return customerRepository.existsByCustomerBusinessRegNo(customerBusinessRegNo);
    }

}
