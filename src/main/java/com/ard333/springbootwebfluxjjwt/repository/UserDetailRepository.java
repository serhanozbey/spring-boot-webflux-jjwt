package com.ard333.springbootwebfluxjjwt.repository;

import com.ard333.springbootwebfluxjjwt.model.AppUserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailRepository extends JpaRepository<AppUserDetail, Long> {
	
	Optional<AppUserDetail> findByAppUserId(Long userId);
	
}
