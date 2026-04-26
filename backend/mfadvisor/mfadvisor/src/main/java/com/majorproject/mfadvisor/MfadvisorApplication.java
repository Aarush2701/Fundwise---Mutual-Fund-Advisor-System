package com.majorproject.mfadvisor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MfadvisorApplication {
	public static void main(String[] args) {
		SpringApplication.run(MfadvisorApplication.class, args);
	}
}
