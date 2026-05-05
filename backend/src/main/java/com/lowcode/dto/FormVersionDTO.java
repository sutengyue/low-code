package com.lowcode.dto;

import lombok.Data;

@Data
public class FormVersionDTO {
    private Long formId;
    private String version;
    private String description;
}