package org.odoo.backend.security.jwt;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.odoo.backend.model.UserRole;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private static final long EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(
            UUID userId,
            UUID companyId,
            UserRole role,
            String email
    ) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("companyId", companyId.toString())
                .claim("role", role.name())
                .claim("email" , email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
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