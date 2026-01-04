package org.odoo.backend.security.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.odoo.backend.model.User;
import org.odoo.backend.model.UserRole;
import org.odoo.backend.repositories.UserRepository;
import org.odoo.backend.security.jwt.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in request: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            log.debug("JWT Token found, attempting to validate");

            Claims claims = jwtService.extractClaims(token);

            UUID userId = UUID.fromString(claims.getSubject());
            UUID companyId = UUID.fromString(
                    claims.get("companyId", String.class)
            );

            UserRole role = UserRole.valueOf(
                    claims.get("role", String.class)
            );

            log.debug("Claims extracted: userId={}, companyId={}, role={}", userId, companyId, role);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            // HARD TENANT CHECK (CORRECT)
            if (!user.getCompany().getCompanyId().equals(companyId)) {
                log.warn("Tenant violation detected for user {}: token companyId={}, user companyId={}", 
                        userId, companyId, user.getCompany().getCompanyId());
                throw new RuntimeException("Tenant violation detected");
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            UserDetails,
                            null,
                            List.of(new SimpleGrantedAuthority(role.name()))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("Authentication set for user: {}", user.getEmail());

        } catch (Exception ex) {
            log.error("JWT validation failed: {}", ex.getMessage());
            // Token invalid / expired / tampered
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}

