import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
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

const mockUsers = [
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@lowcode.com', phone: '13800138000', status: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 2, username: 'user1', nickname: '用户1', email: 'user1@lowcode.com', phone: '13800138001', status: 1, createdAt: '2024-01-02 10:00:00' },
  { id: 3, username: 'user2', nickname: '用户2', email: 'user2@lowcode.com', phone: '13800138002', status: 0, createdAt: '2024-01-03 10:00:00' }
]

function UserList() {
  const [users, setUsers] = useState(mockUsers)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalVisible(true)
    form.resetFields()
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('新增用户:', values)
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
        <h2>用户管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增用户
        </Button>
      </div>
      <Table columns={columns} dataSource={users} rowKey="id" />
      
      <Modal
        title="新增用户"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话" />
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

export default UserList