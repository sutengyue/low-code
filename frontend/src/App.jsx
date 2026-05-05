import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Login from './pages/Login'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import UserList from './pages/system/UserList'
import RoleList from './pages/system/RoleList'
import MenuList from './pages/system/MenuList'
import FormList from './pages/form/FormList'
import FormDesigner from './pages/form/FormDesigner'
import DataList from './pages/data/DataList'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/form/list" />} />
              <Route path="/system/users" element={<UserList />} />
              <Route path="/system/roles" element={<RoleList />} />
              <Route path="/system/menus" element={<MenuList />} />
              <Route path="/form/list" element={<FormList />} />
              <Route path="/form/designer" element={<FormDesigner />} />
              <Route path="/form/designer/:id" element={<FormDesigner />} />
              <Route path="/data/list" element={<DataList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App