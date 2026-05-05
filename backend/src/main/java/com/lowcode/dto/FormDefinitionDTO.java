package com.lowcode.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class FormDefinitionDTO {
    private Long id;
    @NotBlank(message = "表单名称不能为空")
    private String name;
    @NotBlank(message = "表单编码不能为空")
    private String code;
    private String description;
    private Integer status;
    private List<FieldDTO> fields;
}