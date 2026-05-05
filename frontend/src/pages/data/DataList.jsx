import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { listForms, listFormData, saveFormData, updateFormData, deleteFormData } from '../../api/form'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '表单版本', dataIndex: 'formVersion', key: 'formVersion' },
  { title: '数据内容', dataIndex: 'data', key: 'data', render: (data) => {
    if (typeof data === 'object') {
      return <pre style={{ maxHeight: '100px', overflow: 'auto', fontSize: '12px' }}>{JSON.stringify(data, null, 2)}</pre>
    }
    return data
  }},
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { 
    title: '操作', 
    key: 'action', 
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    )
  }
]

function DataList() {
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [dataList, setDataList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingData, setEditingData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadForms()
  }, [])

  useEffect(() => {
    if (selectedForm) {
      loadFormData(selectedForm)
    }
  }, [selectedForm])

  const loadForms = async () => {
    try {
      const res = await listForms({ page: 1, size: 100 })
      setForms(res.data.records || [])
    } catch (error) {
      message.error(error.message || '加载表单列表失败')
    }
  }

  const loadFormData = async (formId) => {
    setLoading(true)
    try {
      const res = await listFormData(formId, { page: 1, size: 100 })
      setDataList(res.data.records || [])
    } catch (error) {
      message.error(error.message || '加载表单数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    if (!selectedForm) {
      message.warning('请先选择表单')
      return
    }
    setEditingData(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingData(record)
    form.setFieldsValue({ data: JSON.stringify(record.data, null, 2) })
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除该数据吗？')) return
    try {
      await deleteFormData(id)
      message.success('删除成功')
      loadFormData(selectedForm)
    } catch (error) {
      message.error(error.message || '删除失败')
    }
  }

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue()
      let data
      try {
        data = JSON.parse(values.data)
      } catch {
        message.error('数据格式不正确')
        return
      }

      if (editingData) {
        await updateFormData(editingData.id, { data })
        message.success('更新成功')
      } else {
        await saveFormData({ formId: selectedForm, data })
        message.success('保存成功')
      }
      setIsModalVisible(false)
      form.resetFields()
      loadFormData(selectedForm)
    } catch (error) {
      message.error(error.message || '保存失败')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingData(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>数据管理</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadForms}>刷新表单列表</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增数据
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>选择表单：</span>
        <Select
          style={{ width: '300px' }}
          placeholder="请选择表单"
          value={selectedForm}
          onChange={(value) => setSelectedForm(value)}
        >
          {forms.map(form => (
            <Select.Option key={form.id} value={form.id}>{form.name}</Select.Option>
          ))}
        </Select>
      </div>

      {selectedForm ? (
        <Table 
          columns={columns} 
          dataSource={dataList} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '100px', background: '#fafafa', borderRadius: '4px' }}>
          <p style={{ color: '#999' }}>请选择表单查看数据</p>
        </div>
      )}

      <Modal
        title={editingData ? '编辑数据' : '新增数据'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="JSON数据" name="data" rules={[{ required: true, message: '请输入数据' }]}>
            <Form.Item name="data" noStyle>
              <textarea
                style={{ width: '100%', height: '300px', fontFamily: 'monospace', fontSize: '14px', padding: '10px' }}
                placeholder='{"key": "value"}'
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataList