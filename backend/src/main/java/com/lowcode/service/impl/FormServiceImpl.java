package com.lowcode.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowcode.dto.*;
import com.lowcode.entity.FormData;

import com.lowcode.entity.FormDefinition;
import com.lowcode.entity.FormVersion;
import com.lowcode.mapper.FormDataMapper;
import com.lowcode.mapper.FormDefinitionMapper;
import com.lowcode.mapper.FormFieldMapper;
import com.lowcode.mapper.FormVersionMapper;
import com.lowcode.service.FormService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FormServiceImpl implements FormService {
    
    private final FormDefinitionMapper formDefinitionMapper;
    private final FormFieldMapper formFieldMapper;
    private final FormVersionMapper formVersionMapper;
    private final FormDataMapper formDataMapper;
    private final ObjectMapper objectMapper;
    
    @Override
    @Transactional
    public FormDefinitionDTO saveForm(FormDefinitionDTO dto) {
        FormDefinition existing = formDefinitionMapper.selectByCode(dto.getCode());
        if (existing != null) {
            throw new RuntimeException("表单编码已存在");
        }
        
        FormDefinition form = new FormDefinition();
        form.setName(dto.getName());
        form.setCode(dto.getCode());
        form.setDescription(dto.getDescription());
        form.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        
        try {
            form.setSchema(objectMapper.writeValueAsString(dto.getFields()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化表单字段失败");
        }
        
        formDefinitionMapper.insert(form);
        
        if (dto.getFields() != null) {
            dto.getFields().forEach(field -> {
                com.lowcode.entity.FormField formField = new com.lowcode.entity.FormField();
                formField.setFormId(form.getId());
                formField.setFieldKey(field.getFieldKey());
                formField.setFieldLabel(field.getFieldLabel());
                formField.setFieldType(field.getFieldType());
                formField.setPlaceholder(field.getPlaceholder());
                formField.setRequired(field.getRequired() != null ? field.getRequired() : 0);
                try {
                    if (field.getValidationRules() != null) {
                        formField.setValidationRules(objectMapper.writeValueAsString(field.getValidationRules()));
                    }
                    if (field.getOptions() != null) {
                        formField.setOptions(objectMapper.writeValueAsString(field.getOptions()));
                    }
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("序列化字段配置失败");
                }
                formField.setDefaultValue(field.getDefaultValue());
                formField.setSortOrder(field.getSortOrder() != null ? field.getSortOrder() : 0);
                formFieldMapper.insert(formField);
            });
        }
        
        return convertToDTO(form);
    }
    
    @Override
    public FormDefinitionDTO getFormById(Long id) {
        FormDefinition form = formDefinitionMapper.selectById(id);
        if (form == null) {
            throw new RuntimeException("表单不存在");
        }
        return convertToDTO(form);
    }
    
    @Override
    public FormDefinitionDTO getFormByCode(String code) {
        FormDefinition form = formDefinitionMapper.selectByCode(code);
        if (form == null) {
            throw new RuntimeException("表单不存在");
        }
        return convertToDTO(form);
    }
    
    @Override
    public IPage<FormDefinition> listForms(int page, int size) {
        Page<FormDefinition> pageParam = new Page<>(page, size);
        return formDefinitionMapper.selectPage(pageParam, null);
    }
    
    @Override
    @Transactional
    public void deleteForm(Long id) {
        formFieldMapper.deleteByFormId(id);
        formDefinitionMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public FormDefinitionDTO updateForm(Long id, FormDefinitionDTO dto) {
        FormDefinition form = formDefinitionMapper.selectById(id);
        if (form == null) {
            throw new RuntimeException("表单不存在");
        }
        
        FormDefinition existing = formDefinitionMapper.selectByCode(dto.getCode());
        if (existing != null && !existing.getId().equals(id)) {
            throw new RuntimeException("表单编码已存在");
        }
        
        form.setName(dto.getName());
        form.setCode(dto.getCode());
        form.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            form.setStatus(dto.getStatus());
        }
        
        try {
            form.setSchema(objectMapper.writeValueAsString(dto.getFields()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化表单字段失败");
        }
        
        formDefinitionMapper.updateById(form);
        
        formFieldMapper.deleteByFormId(id);
        
        if (dto.getFields() != null) {
            dto.getFields().forEach(field -> {
                com.lowcode.entity.FormField formField = new com.lowcode.entity.FormField();
                formField.setFormId(id);
                formField.setFieldKey(field.getFieldKey());
                formField.setFieldLabel(field.getFieldLabel());
                formField.setFieldType(field.getFieldType());
                formField.setPlaceholder(field.getPlaceholder());
                formField.setRequired(field.getRequired() != null ? field.getRequired() : 0);
                try {
                    if (field.getValidationRules() != null) {
                        formField.setValidationRules(objectMapper.writeValueAsString(field.getValidationRules()));
                    }
                    if (field.getOptions() != null) {
                        formField.setOptions(objectMapper.writeValueAsString(field.getOptions()));
                    }
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("序列化字段配置失败");
                }
                formField.setDefaultValue(field.getDefaultValue());
                formField.setSortOrder(field.getSortOrder() != null ? field.getSortOrder() : 0);
                formFieldMapper.insert(formField);
            });
        }
        
        return convertToDTO(form);
    }
    
    @Override
    @Transactional
    public void saveVersion(FormVersionDTO dto) {
        FormDefinition form = formDefinitionMapper.selectById(dto.getFormId());
        if (form == null) {
            throw new RuntimeException("表单不存在");
        }
        
        FormVersion existing = formVersionMapper.selectByFormIdAndVersion(dto.getFormId(), dto.getVersion());
        if (existing != null) {
            throw new RuntimeException("版本已存在");
        }
        
        FormVersion version = new FormVersion();
        version.setFormId(dto.getFormId());
        version.setVersion(dto.getVersion());
        version.setDescription(dto.getDescription());
        version.setSchema(form.getSchema());
        
        formVersionMapper.insert(version);
    }
    
    @Override
    public List<FormVersionDTO> listVersions(Long formId) {
        List<FormVersion> versions = formVersionMapper.selectByFormId(formId);
        return versions.stream().map(v -> {
            FormVersionDTO dto = new FormVersionDTO();
            dto.setFormId(v.getFormId());
            dto.setVersion(v.getVersion());
            dto.setDescription(v.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public FormDefinitionDTO getFormByVersion(Long formId, String version) {
        FormVersion formVersion = formVersionMapper.selectByFormIdAndVersion(formId, version);
        if (formVersion == null) {
            throw new RuntimeException("版本不存在");
        }
        
        FormDefinition form = new FormDefinition();
        form.setId(formId);
        form.setSchema(formVersion.getSchema());
        
        return convertToDTO(form);
    }
    
    @Override
    public Long saveFormData(FormDataDTO dto) {
        FormDefinition form = formDefinitionMapper.selectById(dto.getFormId());
        if (form == null) {
            throw new RuntimeException("表单不存在");
        }
        
        FormData data = new FormData();
        data.setFormId(dto.getFormId());
        data.setFormVersion(dto.getFormVersion() != null ? dto.getFormVersion() : "1.0.0");
        
        try {
            data.setData(objectMapper.writeValueAsString(dto.getData()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化表单数据失败");
        }
        
        formDataMapper.insert(data);
        return data.getId();
    }
    
    @Override
    public FormDataDTO getFormDataById(Long id) {
        FormData data = formDataMapper.selectById(id);
        if (data == null) {
            throw new RuntimeException("表单数据不存在");
        }
        return convertToDataDTO(data);
    }
    
    @Override
    public IPage<FormDataDTO> listFormData(Long formId, int page, int size) {
        Page<FormData> pageParam = new Page<>(page, size);
        IPage<FormData> dataPage = formDataMapper.selectPage(pageParam, null);
        
        return dataPage.convert(this::convertToDataDTO);
    }
    
    @Override
    public void updateFormData(Long id, FormDataDTO dto) {
        FormData data = formDataMapper.selectById(id);
        if (data == null) {
            throw new RuntimeException("表单数据不存在");
        }
        
        try {
            data.setData(objectMapper.writeValueAsString(dto.getData()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化表单数据失败");
        }
        
        formDataMapper.updateById(data);
    }
    
    @Override
    public void deleteFormData(Long id) {
        formDataMapper.deleteById(id);
    }
    
    @Override
    public Map<String, Object> generateCrudApi(Long formId) {
        FormDefinition form = formDefinitionMapper.selectById(formId);
        if (form == null) {
            throw new RuntimeException("表单不存在");
        }
        
        Map<String, Object> apiConfig = new HashMap<>();
        apiConfig.put("formId", formId);
        apiConfig.put("formName", form.getName());
        apiConfig.put("formCode", form.getCode());
        apiConfig.put("apiPrefix", "/api/form/" + form.getCode());
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("list", "/api/form/" + form.getCode() + "/list");
        endpoints.put("get", "/api/form/" + form.getCode() + "/{id}");
        endpoints.put("create", "/api/form/" + form.getCode() + "/create");
        endpoints.put("update", "/api/form/" + form.getCode() + "/{id}");
        endpoints.put("delete", "/api/form/" + form.getCode() + "/{id}");
        
        apiConfig.put("endpoints", endpoints);
        
        return apiConfig;
    }
    
    private FormDefinitionDTO convertToDTO(FormDefinition form) {
        FormDefinitionDTO dto = new FormDefinitionDTO();
        dto.setId(form.getId());
        dto.setName(form.getName());
        dto.setCode(form.getCode());
        dto.setDescription(form.getDescription());
        dto.setStatus(form.getStatus());
        
        if (form.getSchema() != null) {
            try {
                dto.setFields(objectMapper.readValue(form.getSchema(), new TypeReference<List<FieldDTO>>() {}));
            } catch (JsonProcessingException e) {
                dto.setFields(new ArrayList<>());
            }
        }
        
        return dto;
    }
    
    private FormDataDTO convertToDataDTO(FormData data) {
        FormDataDTO dto = new FormDataDTO();
        dto.setId(data.getId());
        dto.setFormId(data.getFormId());
        dto.setFormVersion(data.getFormVersion());
        
        if (data.getData() != null) {
            try {
                dto.setData(objectMapper.readValue(data.getData(), new TypeReference<Map<String, Object>>() {}));
            } catch (JsonProcessingException e) {
                dto.setData(new HashMap<>());
            }
        }
        
        return dto;
    }
}