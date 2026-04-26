package com.majorproject.mfadvisor.security;

import com.majorproject.mfadvisor.model.User;
import org.springframework.beans.factory.annotation.Value;
import com.majorproject.mfadvisor.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtService;
    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");


        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setPassword(null); // Google user
                    newUser.setRiskScore(0);
                    newUser.setInvestorType("MODERATE");
                    return userRepository.save(newUser);
                });

        String jwt = jwtService.generateToken(user.getEmail());

        response.sendRedirect("https://fundwise-mutual-fund-advisor-system.onrender.com/oauth2/redirect?token=" + jwt);

    }
}
