import { useState, useEffect } from 'react'
import { Layout, Menu, Button } from 'antd'
import { 
  SettingOutlined, 
  UserOutlined, 
  TeamOutlined, 
  MenuOutlined,
  FormOutlined,
  DatabaseOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useNavigate, Outlet } from 'react-router-dom'
import { logout } from '../api/auth'

const { Header, Sider, Content } = Layout

const menuItems = [
  {
    key: 'system',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      { key: '/system/users', label: '用户管理', icon: <UserOutlined /> },
      { key: '/system/roles', label: '角色管理', icon: <TeamOutlined /> },
      { key: '/system/menus', label: '菜单管理', icon: <MenuOutlined /> }
    ]
  },
  {
    key: 'form',
    label: '表单设计',
    icon: <FormOutlined />,
    children: [
      { key: '/form/list', label: '表单列表', icon: <DatabaseOutlined /> },
      { key: '/form/designer', label: '表单设计器', icon: <EditOutlined /> }
    ]
  },
  {
    key: 'data',
    label: '数据管理',
    icon: <DatabaseOutlined />,
    children: [
      { key: '/data/list', label: '数据列表', icon: <DatabaseOutlined /> }
    ]
  }
]

function AppLayout() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(['/form/list'])

  useEffect(() => {
    const path = window.location.pathname
    setSelectedKeys([path])
  }, [])

  const handleMenuClick = ({ key }) => {
    navigate(key)
    setSelectedKeys([key])
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
          低代码平台
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>低代码平台</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>欢迎, {user.nickname || user.username}</span>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Header>
        <Content style={{ padding: '20px', background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout