import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, BranchesOutlined, CopyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { listForms, deleteForm } from '../../api/form'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '表单名称', dataIndex: 'name', key: 'name' },
  { title: '表单编码', dataIndex: 'code', key: 'code' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 1 ? '启用' : '禁用' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { 
    title: '操作', 
    key: 'action', 
    render: (_, record) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small">预览</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<BranchesOutlined />} size="small">版本</Button>
        <Button icon={<CopyOutlined />} size="small">复制</Button>
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    )
  }
]

function FormList() {
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    setLoading(true)
    try {
      const res = await listForms({ page: 1, size: 100 })
      setForms(res.data.records || [])
    } catch (error) {
      message.error(error.message || '加载表单列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除该表单吗？')) return
    try {
      await deleteForm(id)
      message.success('删除成功')
      loadForms()
    } catch (error) {
      message.error(error.message || '删除失败')
    }
  }

  const handleCreate = () => {
    navigate('/form/designer')
  }

  const handleEdit = (id) => {
    navigate(`/form/designer/${id}`)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>表单列表</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建表单
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={forms} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default FormList