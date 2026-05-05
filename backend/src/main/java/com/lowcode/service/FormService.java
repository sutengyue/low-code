package com.lowcode.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.lowcode.dto.FormDefinitionDTO;
import com.lowcode.dto.FormDataDTO;
import com.lowcode.dto.FormVersionDTO;
import com.lowcode.entity.FormDefinition;

import java.util.List;
import java.util.Map;

public interface FormService {
    FormDefinitionDTO saveForm(FormDefinitionDTO dto);
    FormDefinitionDTO getFormById(Long id);
    FormDefinitionDTO getFormByCode(String code);
    IPage<FormDefinition> listForms(int page, int size);
    void deleteForm(Long id);
    FormDefinitionDTO updateForm(Long id, FormDefinitionDTO dto);
    void saveVersion(FormVersionDTO dto);
    List<FormVersionDTO> listVersions(Long formId);
    FormDefinitionDTO getFormByVersion(Long formId, String version);
    Long saveFormData(FormDataDTO dto);
    FormDataDTO getFormDataById(Long id);
    IPage<FormDataDTO> listFormData(Long formId, int page, int size);
    void updateFormData(Long id, FormDataDTO dto);
    void deleteFormData(Long id);
    Map<String, Object> generateCrudApi(Long formId);
}