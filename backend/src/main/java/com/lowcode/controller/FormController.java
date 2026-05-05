package com.lowcode.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.lowcode.dto.FormDefinitionDTO;
import com.lowcode.dto.FormDataDTO;
import com.lowcode.dto.FormVersionDTO;
import com.lowcode.dto.Result;
import com.lowcode.entity.FormDefinition;
import com.lowcode.service.FormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/form")
@RequiredArgsConstructor
public class FormController {
    
    private final FormService formService;
    
    @PostMapping
    public Result<FormDefinitionDTO> createForm(@Valid @RequestBody FormDefinitionDTO dto) {
        FormDefinitionDTO result = formService.saveForm(dto);
        return Result.success("表单创建成功", result);
    }
    
    @GetMapping("/{id}")
    public Result<FormDefinitionDTO> getForm(@PathVariable Long id) {
        FormDefinitionDTO result = formService.getFormById(id);
        return Result.success(result);
    }
    
    @GetMapping("/code/{code}")
    public Result<FormDefinitionDTO> getFormByCode(@PathVariable String code) {
        FormDefinitionDTO result = formService.getFormByCode(code);
        return Result.success(result);
    }
    
    @GetMapping
    public Result<IPage<FormDefinition>> listForms(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        IPage<FormDefinition> result = formService.listForms(page, size);
        return Result.success(result);
    }
    
    @PutMapping("/{id}")
    public Result<FormDefinitionDTO> updateForm(@PathVariable Long id, @Valid @RequestBody FormDefinitionDTO dto) {
        FormDefinitionDTO result = formService.updateForm(id, dto);
        return Result.success("表单更新成功", result);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deleteForm(@PathVariable Long id) {
        formService.deleteForm(id);
        return Result.success("表单删除成功", null);
    }
    
    @PostMapping("/version")
    public Result<Void> saveVersion(@RequestBody FormVersionDTO dto) {
        formService.saveVersion(dto);
        return Result.success("版本保存成功", null);
    }
    
    @GetMapping("/{formId}/versions")
    public Result<List<FormVersionDTO>> listVersions(@PathVariable Long formId) {
        List<FormVersionDTO> result = formService.listVersions(formId);
        return Result.success(result);
    }
    
    @GetMapping("/{formId}/version/{version}")
    public Result<FormDefinitionDTO> getFormByVersion(@PathVariable Long formId, @PathVariable String version) {
        FormDefinitionDTO result = formService.getFormByVersion(formId, version);
        return Result.success(result);
    }
    
    @PostMapping("/data")
    public Result<Long> saveFormData(@RequestBody FormDataDTO dto) {
        Long id = formService.saveFormData(dto);
        return Result.success("数据保存成功", id);
    }
    
    @GetMapping("/data/{id}")
    public Result<FormDataDTO> getFormData(@PathVariable Long id) {
        FormDataDTO result = formService.getFormDataById(id);
        return Result.success(result);
    }
    
    @GetMapping("/data/list/{formId}")
    public Result<IPage<FormDataDTO>> listFormData(@PathVariable Long formId, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        IPage<FormDataDTO> result = formService.listFormData(formId, page, size);
        return Result.success(result);
    }
    
    @PutMapping("/data/{id}")
    public Result<Void> updateFormData(@PathVariable Long id, @RequestBody FormDataDTO dto) {
        formService.updateFormData(id, dto);
        return Result.success("数据更新成功", null);
    }
    
    @DeleteMapping("/data/{id}")
    public Result<Void> deleteFormData(@PathVariable Long id) {
        formService.deleteFormData(id);
        return Result.success("数据删除成功", null);
    }
    
    @GetMapping("/{formId}/crud-api")
    public Result<Map<String, Object>> generateCrudApi(@PathVariable Long formId) {
        Map<String, Object> result = formService.generateCrudApi(formId);
        return Result.success(result);
    }
}