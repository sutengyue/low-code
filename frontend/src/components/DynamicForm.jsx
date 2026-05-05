import { Form, Input, Select, Switch, InputNumber, Checkbox, Radio, DatePicker, TextArea } from 'antd'

const fieldComponents = {
  input: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <Input placeholder={field.placeholder} />
    </Form.Item>
  ),
  textarea: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <TextArea placeholder={field.placeholder} />
    </Form.Item>
  ),
  number: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <InputNumber placeholder={field.placeholder} />
    </Form.Item>
  ),
  select: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <Select placeholder={field.placeholder}>
        {field.options?.map(opt => (
          <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  ),
  radio: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <Radio.Group>
        {field.options?.map(opt => (
          <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  ),
  checkbox: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <Checkbox.Group>
        {field.options?.map(opt => (
          <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
        ))}
      </Checkbox.Group>
    </Form.Item>
  ),
  date: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <DatePicker style={{ width: '100%' }} placeholder={field.placeholder} />
    </Form.Item>
  ),
  datetime: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={field.required ? [{ required: true, message: `${field.fieldLabel}不能为空` }] : []}
    >
      <DatePicker showTime style={{ width: '100%' }} placeholder={field.placeholder} />
    </Form.Item>
  ),
  email: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={[
        field.required ? { required: true, message: `${field.fieldLabel}不能为空` } : null,
        { type: 'email', message: '请输入正确的邮箱格式' }
      ].filter(Boolean)}
    >
      <Input type="email" placeholder={field.placeholder} />
    </Form.Item>
  ),
  phone: (field, form) => (
    <Form.Item
      key={field.fieldKey}
      name={field.fieldKey}
      label={field.fieldLabel}
      rules={[
        field.required ? { required: true, message: `${field.fieldLabel}不能为空` } : null,
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
      ].filter(Boolean)}
    >
      <Input type="tel" placeholder={field.placeholder} />
    </Form.Item>
  )
}

function DynamicForm({ fields, form, initialValues }) {
  return (
    <>
      {fields?.map(field => {
        const component = fieldComponents[field.fieldType]
        if (component) {
          return component(field, form)
        }
        return null
      })}
    </>
  )
}

export default DynamicForm