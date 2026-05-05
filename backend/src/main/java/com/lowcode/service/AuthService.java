package com.lowcode.service;

import com.lowcode.dto.LoginRequest;
import com.lowcode.dto.LoginResponse;
import com.lowcode.entity.SysUser;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void logout(String token);
    SysUser getCurrentUser();
    String generateToken(Long userId);
}