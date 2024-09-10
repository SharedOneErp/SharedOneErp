package com.project.erpre;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
public class ErpreApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ErpreApplication.class);

    // @Autowired
    // private JdbcTemplate jdbcTemplate; // JdbcTemplate을 자동으로 주입받기 위해 선언

    public static void main(String[] args) {
        SpringApplication.run(ErpreApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // String sql = "SELECT NOW()"; // PostgreSQL에서 현재 날짜와 시간을 가져오는 쿼리
        // String result = jdbcTemplate.queryForObject(sql, String.class);
        // System.out.println("현재 데이터베이스 시간: " + result);

        LocalDateTime now = LocalDateTime.now(); // 현재 시간을 LocalDateTime 객체로 가져옴
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"); // 출력할 날짜 형식 지정
        String formattedNow = now.format(formatter); // 형식에 맞게 변환
        logger.info("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");
        logger.info("현재 시간: {}", formattedNow); // 현재 시간 로그 출력
        logger.info("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");
    }

}
