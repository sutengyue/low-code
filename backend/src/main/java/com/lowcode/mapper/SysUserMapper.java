package com.lowcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lowcode.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {
    @Select("SELECT u.* FROM sys_user u JOIN sys_user_role ur ON u.id = ur.user_id WHERE ur.role_id = #{roleId}")
    List<SysUser> selectByRoleId(@Param("roleId") Long roleId);
    
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted_at IS NULL")
    SysUser selectByUsername(@Param("username") String username);
}