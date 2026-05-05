import { useState, useEffect } from 'react'
import { 
  Form, Input, Select, Switch, Button, Card, Row, Col, 
  Space, message, Modal, InputNumber, Checkbox, Radio, DatePicker
} from 'antd'
import { 
  PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined, 
  SaveOutlined, EyeOutlined, BranchesOutlined, CopyOutlined 
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { createForm, getForm, updateForm, saveVersion } from '../../api/form'

const fieldTypes = [
  { value: 'input', label: '单行文本', icon: '📝' },
  { value: 'textarea', label: '多行文本', icon: '📄' },
  { value: 'number', label: '数字', icon: '🔢' },
  { value: 'select', label: '下拉选择', icon: '📋' },
  { value: 'radio', label: '单选框', icon: '⚪' },
  { value: 'checkbox', label: '多选框', icon: '☑️' },
  { value: 'date', label: '日期', icon: '📅' },
  { value: 'datetime', label: '日期时间', icon: '🕐' },
  { value: 'email', label: '邮箱', icon: '📧' },
  { value: 'phone', label: '手机号', icon: '📱' }
]

const validationTypes = [
  { value: 'required', label: '必填' },
  { value: 'min', label: '最小长度' },
  { value: 'max', label: '最大长度' },
  { value: 'pattern', label: '正则表达式' }
]

function FormDesigner() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [showVersionModal, setShowVersionModal] = useState(false)
  const [versionInfo, setVersionInfo] = useState({ version: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadForm()
    }
  }, [id])

  const loadForm = async () => {
    try {
      const res = await getForm(id)
      const data = res.data
      form.setFieldsValue({
        name: data.name,
        code: data.code,
        description: data.description,
        status: data.status
      })
      setFields(data.fields || [])
    } catch (error) {
      message.error(error.message || '加载表单失败')
    }
  }

  const handleAddField = (type) => {
    const newField = {
      id: Date.now(),
      fieldKey: `field_${Date.now()}`,
      fieldLabel: '新字段',
      fieldType: type,
      placeholder: '',
      required: false,
      validationRules: [],
      defaultValue: '',
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? 
        [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }] : [],
      sortOrder: fields.length
    }
    setFields([...fields, newField])
    setSelectedField(newField)
  }

  const handleUpdateField = (updatedField) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f))
    setSelectedField(updatedField)
  }

  const handleDeleteField = (fieldId) => {
    if (fields.length <= 1) {
      message.warning('至少保留一个字段')
      return
    }
    setFields(fields.filter(f => f.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const newFields = [...fields]
    ;[newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]]
    setFields(newFields)
  }

  const handleMoveDown = (index) => {
    if (index === fields.length - 1) return
    const newFields = [...fields]
    ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
    setFields(newFields)
  }

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue()
      const data = {
        ...values,
        fields: fields.map((f, index) => ({ ...f, sortOrder: index }))
      }

      setLoading(true)
      if (id) {
        await updateForm(id, data)
        message.success('更新成功')
      } else {
        await createForm(data)
        message.success('创建成功')
        navigate('/form/list')
      }
    } catch (error) {
      message.error(error.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveVersion = async () => {
    if (!versionInfo.version) {
      message.warning('请输入版本号')
      return
    }
    try {
      await saveVersion({ formId: id, ...versionInfo })
      message.success('版本保存成功')
      setShowVersionModal(false)
      setVersionInfo({ version: '', description: '' })
    } catch (error) {
      message.error(error.message || '保存版本失败')
    }
  }

  const renderFieldConfig = () => {
    if (!selectedField) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>请选择一个字段进行配置</div>
    }

    return (
      <Card title="字段配置" style={{ marginTop: '20px' }}>
        <Form layout="vertical" initialValues={selectedField}>
          <Form.Item label="字段标识" name="fieldKey">
            <Input onChange={(e) => handleUpdateField({ ...selectedField, fieldKey: e.target.value })} />
          </Form.Item>
          <Form.Item label="字段标签" name="fieldLabel">
            <Input onChange={(e) => handleUpdateField({ ...selectedField, fieldLabel: e.target.value })} />
          </Form.Item>
          <Form.Item label="字段类型">
            <Select value={selectedField.fieldType} disabled>
              {fieldTypes.map(t => (
                <Select.Option key={t.value} value={t.value}>{t.icon} {t.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="占位提示" name="placeholder">
            <Input onChange={(e) => handleUpdateField({ ...selectedField, placeholder: e.target.value })} />
          </Form.Item>
          <Form.Item label="默认值" name="defaultValue">
            {selectedField.fieldType === 'textarea' ? (
              <Input.TextArea onChange={(e) => handleUpdateField({ ...selectedField, defaultValue: e.target.value })} />
            ) : (
              <Input onChange={(e) => handleUpdateField({ ...selectedField, defaultValue: e.target.value })} />
            )}
          </Form.Item>
          <Form.Item label="必填" name="required" valuePropName="checked">
            <Switch onChange={(checked) => handleUpdateField({ ...selectedField, required: checked })} />
          </Form.Item>
          
          {(selectedField.fieldType === 'select' || selectedField.fieldType === 'radio' || selectedField.fieldType === 'checkbox') && (
            <Form.Item label="选项配置">
              <div style={{ border: '1px dashed #d9d9d9', padding: '10px', borderRadius: '4px' }}>
                {selectedField.options?.map((opt, idx) => (
                  <Row key={idx} gutter={8} style={{ marginBottom: '8px' }}>
                    <Col span={10}>
                      <Input 
                        placeholder="选项标签" 
                        value={opt.label}
                        onChange={(e) => {
                          const newOptions = [...selectedField.options]
                          newOptions[idx] = { ...opt, label: e.target.value }
                          handleUpdateField({ ...selectedField, options: newOptions })
                        }}
                      />
                    </Col>
                    <Col span={10}>
                      <Input 
                        placeholder="选项值" 
                        value={opt.value}
                        onChange={(e) => {
                          const newOptions = [...selectedField.options]
                          newOptions[idx] = { ...opt, value: e.target.value }
                          handleUpdateField({ ...selectedField, options: newOptions })
                        }}
                      />
                    </Col>
                    <Col span={4}>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          if (selectedField.options.length <= 1) return
                          const newOptions = selectedField.options.filter((_, i) => i !== idx)
                          handleUpdateField({ ...selectedField, options: newOptions })
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Button 
                  type="dashed" 
                  block 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const newOptions = [...(selectedField.options || []), { label: `选项${selectedField.options?.length + 1}`, value: `${selectedField.options?.length + 1}` }]
                    handleUpdateField({ ...selectedField, options: newOptions })
                  }}
                >
                  添加选项
                </Button>
              </div>
            </Form.Item>
          )}
        </Form>
      </Card>
    )
  }

  const renderFieldPreview = (field, index) => {
    const isSelected = selectedField?.id === field.id
    
    return (
      <div 
        key={field.id} 
        className={`p-4 border rounded-lg mb-3 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary'}`}
        onClick={() => setSelectedField(field)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>{field.fieldLabel}</span>
            {field.required && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>*</span>}
          </div>
          <Space>
            <Button 
              icon={<UpOutlined />} 
              size="small" 
              onClick={(e) => { e.stopPropagation(); handleMoveUp(index) }}
            />
            <Button 
              icon={<DownOutlined />} 
              size="small" 
              onClick={(e) => { e.stopPropagation(); handleMoveDown(index) }}
            />
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger 
              onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id) }}
            />
          </Space>
        </div>
        
        {field.fieldType === 'input' && <Input placeholder={field.placeholder} />}
        {field.fieldType === 'textarea' && <Input.TextArea placeholder={field.placeholder} />}
        {field.fieldType === 'number' && <InputNumber placeholder={field.placeholder} />}
        {field.fieldType === 'select' && (
          <Select placeholder={field.placeholder}>
            {field.options?.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
          </Select>
        )}
        {field.fieldType === 'radio' && (
          <Radio.Group>
            {field.options?.map(opt => <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>)}
          </Radio.Group>
        )}
        {field.fieldType === 'checkbox' && (
          <Checkbox.Group>
            {field.options?.map(opt => <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>)}
          </Checkbox.Group>
        )}
        {field.fieldType === 'date' && <DatePicker style={{ width: '100%' }} placeholder={field.placeholder} />}
        {field.fieldType === 'datetime' && <DatePicker showTime style={{ width: '100%' }} placeholder={field.placeholder} />}
        {field.fieldType === 'email' && <Input type="email" placeholder={field.placeholder} />}
        {field.fieldType === 'phone' && <Input type="tel" placeholder={field.placeholder} />}
      </div>
    )
  }

  return (
    <div className="form-designer">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>{id ? '编辑表单' : '新建表单'}</h2>
        <Space>
          <Button icon={<BranchesOutlined />} onClick={() => setShowVersionModal(true)}>保存版本</Button>
          <Button icon={<CopyOutlined />}>复制表单</Button>
          <Button icon={<EyeOutlined />}>预览</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
            {id ? '更新表单' : '保存表单'}
          </Button>
        </Space>
      </div>

      <Row gutter={20}>
        <Col span={6}>
          <Card title="字段类型">
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map(type => (
                <Button 
                  key={type.value} 
                  type="dashed" 
                  block
                  onClick={() => handleAddField(type.value)}
                >
                  {type.icon} {type.label}
                </Button>
              ))}
            </div>
          </Card>
          {renderFieldConfig()}
        </Col>
        
        <Col span={12}>
          <Card title="表单配置">
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="表单名称" rules={[{ required: true, message: '请输入表单名称' }]}>
                <Input placeholder="请输入表单名称" />
              </Form.Item>
              <Form.Item name="code" label="表单编码" rules={[{ required: true, message: '请输入表单编码' }]}>
                <Input placeholder="请输入表单编码（唯一标识）" />
              </Form.Item>
              <Form.Item name="description" label="表单描述">
                <Input.TextArea placeholder="请输入表单描述" />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select>
                  <Select.Option value={1}>启用</Select.Option>
                  <Select.Option value={0}>禁用</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
          
          <Card title="表单预览" style={{ marginTop: '20px' }}>
            {fields.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999', border: '1px dashed #d9d9d9', borderRadius: '4px' }}>
                <p>从左侧选择字段类型添加到表单</p>
              </div>
            ) : (
              fields.map((field, index) => renderFieldPreview(field, index))
            )}
          </Card>
        </Col>
        
        <Col span={6}>
          <Card title="字段列表">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className={`p-2 rounded cursor-pointer mb-2 ${selectedField?.id === field.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setSelectedField(field)}
              >
                <span>{index + 1}. {field.fieldLabel}</span>
              </div>
            ))}
            {fields.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>暂无字段</p>}
          </Card>
        </Col>
      </Row>

      <Modal
        title="保存版本"
        visible={showVersionModal}
        onOk={handleSaveVersion}
        onCancel={() => setShowVersionModal(false)}
      >
        <Form layout="vertical">
          <Form.Item label="版本号">
            <Input 
              value={versionInfo.version}
              onChange={(e) => setVersionInfo({ ...versionInfo, version: e.target.value })}
              placeholder="如：1.0.0"
            />
          </Form.Item>
          <Form.Item label="版本描述">
            <Input.TextArea 
              value={versionInfo.description}
              onChange={(e) => setVersionInfo({ ...versionInfo, description: e.target.value })}
              placeholder="描述本次版本更新内容"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FormDesigner