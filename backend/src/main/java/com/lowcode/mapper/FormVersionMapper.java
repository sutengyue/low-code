package com.lowcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lowcode.entity.FormVersion;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FormVersionMapper extends BaseMapper<FormVersion> {
    @Select("SELECT * FROM form_version WHERE form_id = #{formId} ORDER BY created_at DESC")
    List<FormVersion> selectByFormId(@Param("formId") Long formId);
    
    @Select("SELECT * FROM form_version WHERE form_id = #{formId} AND version = #{version}")
    FormVersion selectByFormIdAndVersion(@Param("formId") Long formId, @Param("version") String version);
}