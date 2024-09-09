package com.project.erpre;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class  ErpreApplication implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate; // JdbcTemplate을 자동으로 주입받기 위해 선언

    public static void main(String[] args) {
        SpringApplication.run(ErpreApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        String sql = "SELECT NOW()"; // PostgreSQL에서 현재 날짜와 시간을 가져오는 쿼리
        String result = jdbcTemplate.queryForObject(sql, String.class);
        System.out.println("현재 데이터베이스 시간: " + result);
    }

}
