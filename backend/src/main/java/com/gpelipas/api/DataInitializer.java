package com.gpelipas.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.gpelipas.api.model.User;
import com.gpelipas.api.repository.UserRepository;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        log.info("Seeding initial data...");

        userRepository.save(new User(null, "Alice Johnson", "alice@example.com", "ADMIN", null));
        userRepository.save(new User(null, "Bob Smith", "bob@example.com", "USER", null));
        userRepository.save(new User(null, "Carol White", "carol@example.com", "USER", null));
        userRepository.save(new User(null, "David Brown", "david@example.com", "MANAGER", null));

        log.info("Seeded {} users", userRepository.count());
    }
}
