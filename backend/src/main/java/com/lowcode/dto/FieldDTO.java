package com.lowcode.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class FieldDTO {
    private Long id;
    @NotBlank(message = "字段标识不能为空")
    private String fieldKey;
    @NotBlank(message = "字段标签不能为空")
    private String fieldLabel;
    @NotBlank(message = "字段类型不能为空")
    private String fieldType;
    private String placeholder;
    private Integer required;
    private List<ValidationRuleDTO> validationRules;
    private String defaultValue;
    private List<OptionDTO> options;
    private Integer sortOrder;
}