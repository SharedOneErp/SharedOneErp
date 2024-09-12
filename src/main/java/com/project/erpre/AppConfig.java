// src/main/java/com/project/erpre/AppConfig.java

package com.project.erpre;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AppConfig 클래스는 애플리케이션에서 사용되는 Bean(빈)들을 설정하고 관리하는 역할을 합니다.
 * 특히 ModelMapper와 같은 외부 라이브러리의 객체를 스프링 컨텍스트에서 관리할 수 있도록 빈으로 등록합니다.
 */
@Configuration  // 이 어노테이션은 해당 클래스가 스프링 설정 클래스임을 나타냅니다.
// 스프링은 이 클래스의 메서드에서 반환된 객체들을 빈으로 등록하여 관리합니다.
public class AppConfig {

    /**
     * ModelMapper를 스프링 빈으로 등록하기 위한 메서드입니다.
     * ModelMapper는 엔티티와 DTO 간의 매핑을 자동으로 처리해주는 라이브러리로, 객체 변환을 편리하게 해줍니다.
     *
     * @return ModelMapper 객체를 반환하고, 이 객체는 스프링 컨텍스트에서 관리됩니다.
     */
    @Bean  // 이 어노테이션은 해당 메서드에서 반환되는 객체를 스프링 컨텍스트에서 빈으로 등록함을 나타냅니다.
    public ModelMapper modelMapper() {
        return new ModelMapper();  // ModelMapper 객체 생성 후 반환
    }
}
