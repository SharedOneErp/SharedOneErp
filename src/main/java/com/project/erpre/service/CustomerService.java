package com.project.erpre.service;

import com.project.erpre.model.Customer;
import com.project.erpre.model.CustomerDTO;
import com.project.erpre.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    // 고객 정보 삽입 또는 수정
    public Customer saveOrUpdate(Customer customer) {
        // 기존 고객이 있는 경우 기존의 prices를 유지하고 새로운 데이터를 추가
        Customer existingCustomer = customerRepository.findById(customer.getCustomerNo()).orElse(null);

        if (existingCustomer != null) {
            //기존 컬렉션이 null인지 확인
            if (existingCustomer.getPrices() == null) {
                existingCustomer.setPrices(new ArrayList<>()); // null일 경우 초기화
            }
            if (customer.getPrices() != null) { // 새로운 가격 목록이 null이 아닌지 확인
                existingCustomer.getPrices().clear(); // 기존 내용 비우기
                existingCustomer.getPrices().addAll(customer.getPrices()); //새로운 데이터를 추가
            }

            //나머지 필드 업데이트
            existingCustomer.setCustomerName(customer.getCustomerName());
            existingCustomer.setCustomerTel(customer.getCustomerTel());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerRepresentativeName());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerBusinessRegNo());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerAddr());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerFaxNo());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerManagerName());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerManagerEmail());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerManagerTel());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerCountryCode());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerType());
            existingCustomer.setCustomerRepresentativeName(customer.getCustomerEtaxInvoiceYn());

            return customerRepository.save(existingCustomer);

        } else {
            // 새로운 고객 추가
            if (customer.getPrices() == null) {
                customer.setPrices(new ArrayList<>()); // 새로운 고객에 대해 prices가 null일 경우 초기화
            }
            return customerRepository.save(customer);
        }
    }

    // 고객 정보 삭제
    public void deleteCustomer(Integer customerNo) {
        customerRepository.deleteById(customerNo);
    }

    public List<Customer> searchCustomers(String name) {
        return customerRepository.findByCustomerNameContainingIgnoreCase(name);
    }
}
