package com.lowcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lowcode.entity.FormDefinition;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FormDefinitionMapper extends BaseMapper<FormDefinition> {
    @Select("SELECT * FROM form_definition WHERE code = #{code}")
    FormDefinition selectByCode(@Param("code") String code);
}