CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500),
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255),
    component VARCHAR(255),
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    type TINYINT DEFAULT 1,
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS sys_role_menu (
    role_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, menu_id)
);

CREATE TABLE IF NOT EXISTS form_definition (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    `schema` JSON,
    status TINYINT DEFAULT 1,
    created_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form_field (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    form_id BIGINT NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    field_label VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    placeholder VARCHAR(200),
    required TINYINT DEFAULT 0,
    validation_rules JSON,
    default_value TEXT,
    options JSON,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form_version (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    form_id BIGINT NOT NULL,
    version VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    `schema` JSON,
    created_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    form_id BIGINT NOT NULL,
    form_version VARCHAR(50),
    data JSON NOT NULL,
    created_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO sys_role (name, code, description) VALUES ('管理员', 'admin', '系统管理员');
INSERT INTO sys_role (name, code, description) VALUES ('普通用户', 'user', '普通用户');

INSERT INTO sys_user (username, password, nickname, status) VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '管理员', 1);

INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);

INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (0, '系统管理', '/system', '', 'setting', 1, 1);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (1, '用户管理', '/system/users', 'system/users', 'user', 1, 2);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (1, '角色管理', '/system/roles', 'system/roles', 'team', 2, 2);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (1, '菜单管理', '/system/menus', 'system/menus', 'menu', 3, 2);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (0, '表单设计', '/form', '', 'form', 2, 1);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (5, '表单列表', '/form/list', 'form/list', 'database', 1, 2);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (5, '表单设计器', '/form/designer', 'form/designer', 'edit', 2, 2);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (0, '数据管理', '/data', '', 'table', 3, 1);
INSERT INTO sys_menu (parent_id, name, path, component, icon, sort_order, type) VALUES (8, '数据列表', '/data/list', 'data/list', 'database', 1, 2);

INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 1);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 2);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 3);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 4);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 5);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 6);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 7);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 8);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 9);