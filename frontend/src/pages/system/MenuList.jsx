import { useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, Tree } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, UserOutlined, TeamOutlined, MenuOutlined, FormOutlined, DatabaseOutlined, EditOutlined as EditIcon } from '@ant-design/icons'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '菜单名称', dataIndex: 'name', key: 'name' },
  { title: '父菜单', dataIndex: 'parentName', key: 'parentName' },
  { title: '路径', dataIndex: 'path', key: 'path' },
  { title: '组件', dataIndex: 'component', key: 'component' },
  { title: '类型', dataIndex: 'type', key: 'type', render: (type) => type === 1 ? '菜单' : '按钮' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 1 ? '启用' : '禁用' },
  { 
    title: '操作', 
    key: 'action', 
    render: (_, record) => (
      <Space>
        <Button icon={<EditIcon />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </Space>
    )
  }
]

const iconOptions = [
  { value: 'setting', label: '设置', icon: <SettingOutlined /> },
  { value: 'user', label: '用户', icon: <UserOutlined /> },
  { value: 'team', label: '团队', icon: <TeamOutlined /> },
  { value: 'menu', label: '菜单', icon: <MenuOutlined /> },
  { value: 'form', label: '表单', icon: <FormOutlined /> },
  { value: 'database', label: '数据库', icon: <DatabaseOutlined /> },
  { value: 'edit', label: '编辑', icon: <EditIcon /> }
]

const mockMenus = [
  { id: 1, name: '系统管理', parentId: 0, parentName: '无', path: '/system', component: '', icon: 'setting', type: 1, status: 1 },
  { id: 2, name: '用户管理', parentId: 1, parentName: '系统管理', path: '/system/users', component: 'system/users', icon: 'user', type: 2, status: 1 },
  { id: 3, name: '角色管理', parentId: 1, parentName: '系统管理', path: '/system/roles', component: 'system/roles', icon: 'team', type: 2, status: 1 },
  { id: 4, name: '菜单管理', parentId: 1, parentName: '系统管理', path: '/system/menus', component: 'system/menus', icon: 'menu', type: 2, status: 1 },
  { id: 5, name: '表单设计', parentId: 0, parentName: '无', path: '/form', component: '', icon: 'form', type: 1, status: 1 },
  { id: 6, name: '表单列表', parentId: 5, parentName: '表单设计', path: '/form/list', component: 'form/list', icon: 'database', type: 2, status: 1 },
  { id: 7, name: '表单设计器', parentId: 5, parentName: '表单设计', path: '/form/designer', component: 'form/designer', icon: 'edit', type: 2, status: 1 },
  { id: 8, name: '数据管理', parentId: 0, parentName: '无', path: '/data', component: '', icon: 'database', type: 1, status: 1 },
  { id: 9, name: '数据列表', parentId: 8, parentName: '数据管理', path: '/data/list', component: 'data/list', icon: 'database', type: 2, status: 1 }
]

function MenuList() {
  const [menus, setMenus] = useState(mockMenus)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalVisible(true)
    form.resetFields()
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('新增菜单:', values)
      setIsModalVisible(false)
      form.resetFields()
    }).catch(info => {
      console.log('校验失败:', info)
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>菜单管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增菜单
        </Button>
      </div>
      <Table columns={columns} dataSource={menus} rowKey="id" />
      
      <Modal
        title="新增菜单"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="菜单名称" rules={[{ required: true }]}>
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item name="parentId" label="父菜单">
            <Select>
              <Select.Option value={0}>无（一级菜单）</Select.Option>
              {menus.filter(m => m.type === 1).map(m => (
                <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="path" label="路径">
            <Input placeholder="请输入路径" />
          </Form.Item>
          <Form.Item name="component" label="组件路径">
            <Input placeholder="请输入组件路径" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Select>
              {iconOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Select>
              <Select.Option value={1}>菜单</Select.Option>
              <Select.Option value={2}>按钮</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MenuList