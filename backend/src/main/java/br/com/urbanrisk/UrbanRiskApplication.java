package br.com.urbanrisk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UrbanRiskApplication {

    public static void main(String[] args) {
        SpringApplication.run(UrbanRiskApplication.class, args);
    }
}
