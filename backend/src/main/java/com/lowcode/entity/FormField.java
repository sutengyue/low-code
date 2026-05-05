package com.lowcode.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("form_field")
public class FormField {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long formId;
    private String fieldKey;
    private String fieldLabel;
    private String fieldType;
    private String placeholder;
    private Integer required;
    private String validationRules;
    private String defaultValue;
    private String options;
    private Integer sortOrder;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}