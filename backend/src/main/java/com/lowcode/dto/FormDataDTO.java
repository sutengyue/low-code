package com.lowcode.dto;

import lombok.Data;

import java.util.Map;

@Data
public class FormDataDTO {
    private Long id;
    private Long formId;
    private String formVersion;
    private Map<String, Object> data;
}