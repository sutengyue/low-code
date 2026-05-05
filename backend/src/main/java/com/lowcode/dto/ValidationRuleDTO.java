package com.lowcode.dto;

import lombok.Data;

@Data
public class ValidationRuleDTO {
    private String type;
    private String message;
    private Integer min;
    private Integer max;
    private String pattern;
}