package com.lowcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lowcode.entity.FormField;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FormFieldMapper extends BaseMapper<FormField> {
    @Select("SELECT * FROM form_field WHERE form_id = #{formId} ORDER BY sort_order")
    List<FormField> selectByFormId(@Param("formId") Long formId);
    
    @Select("DELETE FROM form_field WHERE form_id = #{formId}")
    void deleteByFormId(@Param("formId") Long formId);
}