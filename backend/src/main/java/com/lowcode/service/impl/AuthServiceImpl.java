package com.lowcode.service.impl;

import com.lowcode.dto.LoginRequest;
import com.lowcode.dto.LoginResponse;
import com.lowcode.dto.MenuDTO;
import com.lowcode.entity.SysMenu;
import com.lowcode.entity.SysRole;
import com.lowcode.entity.SysUser;
import com.lowcode.mapper.SysMenuMapper;
import com.lowcode.mapper.SysRoleMapper;
import com.lowcode.mapper.SysUserMapper;
import com.lowcode.service.AuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final SysUserMapper sysUserMapper;
    private final SysRoleMapper sysRoleMapper;
    private final SysMenuMapper sysMenuMapper;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Long expiration;
    
    private SecretKey key;
    
    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    
    @Override
    public LoginResponse login(LoginRequest request) {
        SysUser user = sysUserMapper.selectByUsername(request.getUsername());
        if (user == null || user.getDeletedAt() != null) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (user.getStatus() != 1) {
            throw new RuntimeException("用户已禁用");
        }
        
        String token = generateToken(user.getId());
        List<SysRole> roles = sysRoleMapper.selectByUserId(user.getId());
        List<SysMenu> menus = sysMenuMapper.selectByUserId(user.getId());
        
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setNickname(user.getNickname());
        response.setRoles(roles.stream().map(SysRole::getCode).collect(Collectors.toList()));
        response.setMenus(buildMenuTree(menus));
        
        redisTemplate.opsForValue().set("token:" + token, user.getId().toString(), expiration);
        
        return response;
    }
    
    @Override
    public void logout(String token) {
        if (StringUtils.hasText(token)) {
            redisTemplate.delete("token:" + token);
        }
    }
    
    @Override
    public SysUser getCurrentUser() {
        return null;
    }
    
    @Override
    public String generateToken(Long userId) {
        return Jwts.builder()
                .subject(userId.toString())
                .signWith(key)
                .compact();
    }
    
    private List<MenuDTO> buildMenuTree(List<SysMenu> menus) {
        List<MenuDTO> tree = new ArrayList<>();
        menus.forEach(menu -> {
            if (menu.getParentId() == 0) {
                tree.add(buildMenuNode(menu, menus));
            }
        });
        return tree;
    }
    
    private MenuDTO buildMenuNode(SysMenu menu, List<SysMenu> menus) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setPath(menu.getPath());
        dto.setComponent(menu.getComponent());
        dto.setIcon(menu.getIcon());
        dto.setType(menu.getType());
        
        List<MenuDTO> children = menus.stream()
                .filter(m -> m.getParentId().equals(menu.getId()))
                .map(m -> buildMenuNode(m, menus))
                .collect(Collectors.toList());
        dto.setChildren(children);
        
        return dto;
    }
}