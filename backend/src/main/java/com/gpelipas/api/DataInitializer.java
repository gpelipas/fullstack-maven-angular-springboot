package com.gpelipas.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.gpelipas.api.model.User;
import com.gpelipas.api.repository.UserRepository;


@Profile("!prod && !sit") 
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        log.info("Seeding initial data...");

        userRepository.save(new User(null, "Robert Plant", "plant@ledzeprocknroll.com", "ADMIN", null));
        userRepository.save(new User(null, "Jimmy Page", "jimpage@ledzeprocknroll.net", "USER", null));
        userRepository.save(new User(null, "Paul Jones", "pauljones@ledzeprocknroll.com", "USER", null));
        userRepository.save(new User(null, "John Bonham", "bonzo@ledzeprocknroll.com", "MANAGER", null));

        log.info("Seeded {} users", userRepository.count());
    }
}
