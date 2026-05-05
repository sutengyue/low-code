package com.lowcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lowcode.entity.FormData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FormDataMapper extends BaseMapper<FormData> {
    @Select("SELECT * FROM form_data WHERE form_id = #{formId} ORDER BY created_at DESC")
    List<FormData> selectByFormId(@Param("formId") Long formId);
}