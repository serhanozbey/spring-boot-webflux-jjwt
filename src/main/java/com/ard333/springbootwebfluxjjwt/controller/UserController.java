package com.ard333.springbootwebfluxjjwt.controller;

import com.ard333.springbootwebfluxjjwt.model.AppUserDetail;
import com.ard333.springbootwebfluxjjwt.model.UserPrincipal;
import com.ard333.springbootwebfluxjjwt.repository.UserDetailRepository;
import com.ard333.springbootwebfluxjjwt.security.SecurityContextRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
public class UserController {

    @Autowired
    private UserDetailRepository userDetailRepository;
    
    @Autowired
    private SecurityContextRepository securityContextRepository;
    
    @GetMapping("/user/me")
    public Mono<AppUserDetail> getCurrentUser(ServerWebExchange exchange) {
        return securityContextRepository.load(exchange).map(securityContext -> {
            Authentication authentication = securityContext.getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            return userDetailRepository.findByAppUserId(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
        });
        
    }
}
