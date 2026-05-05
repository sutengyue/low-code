package com.lowcode.dto;

import lombok.Data;

import java.util.List;

@Data
public class MenuDTO {
    private Long id;
    private String name;
    private String path;
    private String component;
    private String icon;
    private Integer type;
    private List<MenuDTO> children;
}