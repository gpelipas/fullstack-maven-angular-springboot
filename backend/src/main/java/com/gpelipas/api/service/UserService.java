package com.gpelipas.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.gpelipas.api.exception.DuplicateEmailException;
import com.gpelipas.api.exception.ResourceNotFoundException;
import com.gpelipas.api.model.User;
import com.gpelipas.api.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public User update(Long id, User updated) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Allow same email on same user, but reject if another user owns it
        if (!existing.getEmail().equalsIgnoreCase(updated.getEmail())
                && userRepository.existsByEmail(updated.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + updated.getEmail());
        }

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setRole(updated.getRole());
        return userRepository.save(existing);
    }

    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
