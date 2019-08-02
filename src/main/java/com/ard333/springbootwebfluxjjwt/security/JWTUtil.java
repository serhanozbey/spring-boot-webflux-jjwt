package com.ard333.springbootwebfluxjjwt.security;

import com.ard333.springbootwebfluxjjwt.model.User;
import java.io.Serializable;
import java.security.Key;
import java.security.KeyFactory;
import java.security.Security;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.ard333.springbootwebfluxjjwt.model.UserPrincipal;
import com.sun.org.apache.xml.internal.security.keys.keyresolver.implementations.PrivateKeyResolver;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;

/**
 *
 * @author ard333
 */
@Component
public class JWTUtil implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Value("${springbootwebfluxjjwt.jjwt.secret}")
	private String secret;
	
	@Value("${springbootwebfluxjjwt.jjwt.expiration}")
	private String expirationTime;
	
	public Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(Base64.getEncoder().encodeToString(secret.getBytes())).parseClaimsJws(token).getBody();
	}
	
	public String getUsernameFromToken(String token) {
		return getAllClaimsFromToken(token).getSubject();
	}
	
	public Date getExpirationDateFromToken(String token) {
		return getAllClaimsFromToken(token).getExpiration();
	}
	
	private Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}
	
	public String generateToken(UserPrincipal userPrincipal) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("role", userPrincipal.getAuthorities());
		return doGenerateToken(claims, userPrincipal.getUsername());
	}

	private String doGenerateToken(Map<String, Object> claims, String username) {
		Long expirationTimeLong = Long.parseLong(expirationTime); //in second
		
		final Date createdDate = new Date();
		final Date expirationDate = new Date(createdDate.getTime() + expirationTimeLong * 1000);
		return Jwts.builder()
				.setClaims(claims)
				.setSubject(username)
				.setIssuedAt(createdDate)
				.setExpiration(expirationDate)
				.signWith(Keys.hmacShaKeyFor(secret.getBytes()),SignatureAlgorithm.HS512)
				.compact();
	}
	
	public Boolean validateToken(String token) {
		return !isTokenExpired(token);
	}

}
