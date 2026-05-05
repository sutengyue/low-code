package com.lowcode.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("form_version")
public class FormVersion {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long formId;
    private String version;
    private String description;
    private String schema;
    private Long createdBy;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}