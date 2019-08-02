package com.ard333.springbootwebfluxjjwt.repository;

import com.ard333.springbootwebfluxjjwt.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser,Long> {
	
	Optional<AppUser> findByUsername(String username);
	Optional<AppUser> findByEmail(String email);
	Optional<AppUser> deleteByEmail(String email);
	
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	boolean existsByEmailOrUsername(String email, String username);
	
}