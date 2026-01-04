package org.odoo.backend.security.jwt;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.odoo.backend.model.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private final Key key;
    private final long expirationTime;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTime
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
    }

    public String generateToken(
            UUID userId,
            UUID companyId,
            UserRole role,
            String email
    ) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("companyId", companyId.toString())
                .claim("role", role.name())
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(
                extractClaims(token).getSubject()
        );
    }

    public UUID extractCompanyId(String token) {
        return UUID.fromString(
                extractClaims(token).get("companyId", String.class)
        );
    }

    public UserRole extractRole(String token) {
        return UserRole.valueOf(
                extractClaims(token).get("role", String.class)
        );
    }


}