package com.gpelipas.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gpelipas.api.model.User;
import com.gpelipas.api.service.UserService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("getAllUsers triggered");

        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        log.info("getUserById triggered");

        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody User user) {
        log.info("createUser triggered");

        // DuplicateEmailException   → handled by GlobalExceptionHandler → 409
        // MethodArgumentNotValidException → handled by GlobalExceptionHandler → 400
        return userService.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable("id") Long id, @Valid @RequestBody User user) {
        log.info("updateUser triggered");
        // ResourceNotFoundException  → handled by GlobalExceptionHandler → 404
        // DuplicateEmailException    → handled by GlobalExceptionHandler → 409
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable("id") Long id) {
        log.info("deleteUser triggered");
        
        // ResourceNotFoundException  → handled by GlobalExceptionHandler → 404
        userService.deleteById(id);
    }
}
