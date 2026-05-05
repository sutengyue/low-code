import { useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, Checkbox, Tree } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '角色编码', dataIndex: 'code', key: 'code' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 1 ? '启用' : '禁用' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { 
    title: '操作', 
    key: 'action', 
    render: (_, record) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small">查看</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </Space>
    )
  }
]

const mockRoles = [
  { id: 1, name: '管理员', code: 'admin', description: '系统管理员', status: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 2, name: '普通用户', code: 'user', description: '普通用户', status: 1, createdAt: '2024-01-02 10:00:00' }
]

const menuTreeData = [
  {
    title: '系统管理',
    key: '1',
    children: [
      { title: '用户管理', key: '2' },
      { title: '角色管理', key: '3' },
      { title: '菜单管理', key: '4' }
    ]
  },
  {
    title: '表单设计',
    key: '5',
    children: [
      { title: '表单列表', key: '6' },
      { title: '表单设计器', key: '7' }
    ]
  },
  {
    title: '数据管理',
    key: '8',
    children: [
      { title: '数据列表', key: '9' }
    ]
  }
]

function RoleList() {
  const [roles, setRoles] = useState(mockRoles)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalVisible(true)
    form.resetFields()
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('新增角色:', values)
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
        <h2>角色管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增角色
        </Button>
      </div>
      <Table columns={columns} dataSource={roles} rowKey="id" />
      
      <Modal
        title="新增角色"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="角色编码" rules={[{ required: true }]}>
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="menus" label="权限菜单">
            <Tree
              checkable
              treeData={menuTreeData}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleList