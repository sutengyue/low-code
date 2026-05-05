package com.lowcode;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@MapperScan("com.lowcode.mapper")
@EnableCaching
public class LowCodeApplication {
    public static void main(String[] args) {
        SpringApplication.run(LowCodeApplication.class, args);
    }
}