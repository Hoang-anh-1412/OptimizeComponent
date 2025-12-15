'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { Dropdown } from '@/components/ui/Dropdown'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Toast } from '@/components/ui/Toast'
import { EditableTable, MemoEditableCell } from '@/components/ui/EditableTable'
import { useModal } from '@/hooks/useModal'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import EditableTableV2 from '@/components/ui/edittablecellv2'

export default function Home() {
  // ✅ Chỉ lấy actions, không subscribe vào state để tránh re-render
  const { showModal, closeModal } = useModal()
  const [showAlert, setShowAlert] = useState(true)
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([])
  
  // Log khi component render
  useEffect(() => {
    console.log('🟢 [Page] Component rendered')
  })
  
  // Log khi component mount
  useEffect(() => {
    console.log('🔵 [Page] Component mounted')
    return () => {
      console.log('🔴 [Page] Component unmounted')
    }
  }, [])
  
  // ❌ Bỏ useEffect theo dõi isOpen để tránh re-render
  // Nếu cần biết modal state, subscribe trực tiếp:
  // const isOpen = useModalStore((state) => state.isOpen)
  
  // Sample data for editable table
  type TableData = {
    id: number
    select_flag?: string
    name: string
    email: string
    role: string
    status: string
  }
  
  // ✅ tableData là state - sẽ update khi data thay đổi
  const [tableData, setTableData] = useState<TableData[]>([
    { id: 1, select_flag: '', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Admin', status: 'Active' },
    { id: 2, select_flag: '', name: 'Trần Thị B', email: 'tranthib@example.com', role: 'User', status: 'Active' },
    { id: 3, select_flag: '', name: 'Lê Văn C', email: 'levanc@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, select_flag: '', name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'User', status: 'Active' },
    { id: 5, select_flag: '', name: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'Admin', status: 'Active' },
    { id: 6, select_flag: '', name: 'Vũ Thị F', email: 'vuthif@example.com', role: 'Editor', status: 'Inactive' },
    { id: 7, select_flag: '', name: 'Đỗ Văn G', email: 'dovang@example.com', role: 'User', status: 'Active' },
    { id: 8, select_flag: '', name: 'Bùi Thị H', email: 'buithih@example.com', role: 'User', status: 'Active' },
  ])
  
  // Create column helper - memoized to ensure stability
  const columnHelper = useMemo(() => {
    return createColumnHelper<TableData>()
  }, [])
  
  // ✅ Update state khi data thay đổi
  const handleTableDataChange = useMemo(() => {
    return (newData: TableData[]) => {
      setTableData(newData)
      // Không hiển thị toast cho mỗi lần thay đổi để tránh spam
      // showToast('Dữ liệu đã được cập nhật!', 'success')
    }
  }, [])

  // ✅ Memoize validate function để tránh tạo lại mỗi lần render
  const validateName = useMemo(() => {
    return (value: any) => {
      if (!value || value.trim() === '') {
        return 'Tên không được để trống'
      }
      return null
    }
  }, [])

  // ✅ Columns được memoize với useMemo - tránh tạo lại columns mỗi lần render
  const tableColumns = useMemo(() => {
    return [
    // Select column (Checkbox)
    columnHelper.accessor('select_flag', {
      header: '選',
      cell: ({ row, getValue, table }) => {
        const isChecked = getValue() === '1'
        const updateData = table.options.meta?.updateData
        
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                updateData?.(row.index, 'select_flag', e.target.checked ? '1' : '')
              }}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
          </div>
        )
      },
      meta: { editable: false },
    }),
    // ID column
    columnHelper.accessor('id', {
      header: 'ID',
      cell: ({ row, getValue }) => {
        return (
          <span className="px-2 py-1 block">{getValue() || '-'}</span>
        )
      },
      meta: { editable: false },
    }),
    // Name column - sử dụng MemoEditableCell để tránh re-render
    columnHelper.accessor('name', {
      header: 'Tên',
      cell: ({ row, getValue, table }) => {
        const updateData = table.options.meta?.updateData
        
        return (
          <MemoEditableCell
            value={getValue()}
            row={row}
            columnId="name"
            onUpdate={updateData || (() => {})}
            editable={true}
            validate={validateName}
          />
        )
      },
    }),
    // Email column - sử dụng MemoEditableCell
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ row, getValue, table }) => {
        const updateData = table.options.meta?.updateData
        
        return (
          <MemoEditableCell
            value={getValue()}
            row={row}
            columnId="email"
            onUpdate={updateData || (() => {})}
            editable={true}
          />
        )
      },
    }),
    // Role column - sử dụng MemoEditableCell
    columnHelper.accessor('role', {
      header: 'Vai trò',
      cell: ({ row, getValue, table }) => {
        const updateData = table.options.meta?.updateData
        
        return (
          <MemoEditableCell
            value={getValue()}
            row={row}
            columnId="role"
            onUpdate={updateData || (() => {})}
            editable={true}
          />
        )
      },
    }),
    // Status column - sử dụng MemoEditableCell
    columnHelper.accessor('status', {
      header: 'Trạng thái',
      cell: ({ row, getValue, table }) => {
        const updateData = table.options.meta?.updateData
        
        return (
          <MemoEditableCell
            value={getValue()}
            row={row}
            columnId="status"
            onUpdate={updateData || (() => {})}
            editable={true}
          />
        )
      },
    }),
  ]
  }, [columnHelper, validateName]) // ✅ Dependencies: columnHelper và validateName
  
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }
  
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <EditableTableV2 />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Component Showcase
          </h1>
          <p className="text-gray-600 text-lg">
            Bộ sưu tập các component UI được xây dựng với Next.js và Tailwind CSS
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button Component */}
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Input Component */}
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input label="Tên người dùng" placeholder="Nhập tên của bạn" />
                <Input label="Email" type="email" placeholder="email@example.com" />
                <Input
                  label="Mật khẩu"
                  type="password"
                  placeholder="••••••••"
                  error="Mật khẩu phải có ít nhất 8 ký tự"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Badge Component */}
          <Card>
            <CardHeader>
              <CardTitle>Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Alert Component */}
          <Card>
            <CardHeader>
              <CardTitle>Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {showAlert && (
                  <Alert variant="info" onClose={() => setShowAlert(false)}>
                    Đây là thông báo thông tin
                  </Alert>
                )}
                <Alert variant="success">Thao tác thành công!</Alert>
                <Alert variant="warning">Cảnh báo: Vui lòng kiểm tra lại</Alert>
                <Alert variant="error">Đã xảy ra lỗi</Alert>
              </div>
            </CardContent>
          </Card>
          
          {/* Modal Component - Global State */}
          <Card>
            <CardHeader>
              <CardTitle>Modal (Global State)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() =>
                    showModal({
                      title: 'Modal Example',
                      size: 'md',
                      content: (
                        <>
                          <p className="text-gray-600 mb-4">
                            Đây là modal được quản lý bởi global state (Zustand).
                            Bạn có thể gọi modal từ bất kỳ đâu trong ứng dụng!
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={closeModal}
                            >
                              Hủy
                            </Button>
                            <Button onClick={closeModal}>
                              Xác nhận
                            </Button>
                          </div>
                        </>
                      ),
                    })
                  }
                >
                  Mở Modal (Global)
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    showModal({
                      title: 'Modal Không Có Nút Đóng',
                      size: 'lg',
                      showCloseButton: false,
                      content: (
                        <div>
                          <p className="text-gray-600 mb-4">
                            Modal này không có nút đóng ở header. Bạn có thể click
                            bên ngoài để đóng hoặc thêm nút đóng trong content.
                          </p>
                          <Button onClick={closeModal}>
                            Đóng Modal
                          </Button>
                        </div>
                      ),
                    })
                  }
                >
                  Modal Không Có Nút Đóng
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    showModal({
                      size: 'sm',
                      content: (
                        <div>
                          <p className="text-gray-600 mb-4">
                            Modal nhỏ không có tiêu đề
                          </p>
                          <Button onClick={closeModal}>
                            Đóng
                          </Button>
                        </div>
                      ),
                    })
                  }
                >
                  Modal Nhỏ Không Tiêu Đề
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Dropdown Component */}
          <Card>
            <CardHeader>
              <CardTitle>Dropdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Dropdown
                trigger={<Button>Menu Dropdown</Button>}
                items={[
                  { label: 'Tùy chọn 1', onClick: () => showToast('Đã chọn tùy chọn 1', 'success') },
                  { label: 'Tùy chọn 2', onClick: () => showToast('Đã chọn tùy chọn 2', 'info') },
                  { label: 'Tùy chọn 3', onClick: () => showToast('Đã chọn tùy chọn 3', 'warning') },
                  { label: 'Vô hiệu hóa', onClick: () => {}, disabled: true },
                ]}
              />
            </CardContent>
          </Card>
          
          {/* Spinner Component */}
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs Component */}
          <Card>
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                tabs={[
                  {
                    id: 'tab1',
                    label: 'Tab 1',
                    content: <p className="text-gray-600">Nội dung của Tab 1</p>,
                  },
                  {
                    id: 'tab2',
                    label: 'Tab 2',
                    content: <p className="text-gray-600">Nội dung của Tab 2</p>,
                  },
                  {
                    id: 'tab3',
                    label: 'Tab 3',
                    content: <p className="text-gray-600">Nội dung của Tab 3</p>,
                  },
                ]}
              />
            </CardContent>
          </Card>
          
          {/* Avatar Component */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar name="Nguyễn Văn A" size="sm" />
                <Avatar name="Trần Thị B" size="md" />
                <Avatar name="Lê Văn C" size="lg" />
                <Avatar name="Phạm Thị D" size="xl" />
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Component */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={25} showLabel color="primary" />
                <Progress value={50} showLabel color="success" />
                <Progress value={75} showLabel color="warning" />
                <Progress value={90} showLabel color="danger" />
              </div>
            </CardContent>
          </Card>
          
          {/* Toast Component Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Toast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={() => showToast('Thành công!', 'success')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="danger"
                  onClick={() => showToast('Có lỗi xảy ra!', 'error')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => showToast('Thông tin', 'info')}
                >
                  Info Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Editable Table */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Editable Table (TanStack Table)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Tất cả các cell mặc định ở chế độ chỉnh sửa. Nhấn Enter để lưu, Esc để hủy thay đổi.
                </p>
                <EditableTable
                  data={tableData}
                  columns={tableColumns as ColumnDef<TableData>[]}
                  onDataChange={handleTableDataChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Toast Container */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

