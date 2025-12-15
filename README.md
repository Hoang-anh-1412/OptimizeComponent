# Component Showcase - Next.js & Tailwind CSS

Ứng dụng Next.js với Tailwind CSS bao gồm nhiều component UI có thể tái sử dụng.

## Tính năng

- ✅ Next.js 14 với App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Zustand cho state management
- ✅ Global Modal State - Gọi modal từ bất kỳ đâu
- ✅ Nhiều component UI đẹp và hiện đại

## Các Component

- **Button** - Nút bấm với nhiều variant và size
- **Card** - Thẻ hiển thị nội dung
- **Input** - Trường nhập liệu với validation
- **Badge** - Nhãn hiển thị trạng thái
- **Alert** - Thông báo cảnh báo
- **Modal** - Hộp thoại popup
- **Dropdown** - Menu dropdown
- **Spinner** - Loading indicator
- **Tabs** - Tab navigation
- **Avatar** - Ảnh đại diện người dùng
- **Progress** - Thanh tiến trình
- **Toast** - Thông báo toast

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

## Cấu trúc thư mục

```
├── app/
│   ├── globals.css      # Global styles với Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Trang chủ showcase components
├── app/
│   ├── globals.css      # Global styles với Tailwind
│   ├── layout.tsx       # Root layout (chứa GlobalModal)
│   └── page.tsx         # Trang chủ showcase components
├── components/
│   ├── ui/              # Tất cả các UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Spinner.tsx
│   │   ├── Tabs.tsx
│   │   ├── Avatar.tsx
│   │   ├── Progress.tsx
│   │   └── Toast.tsx
│   ├── GlobalModal.tsx  # Global modal component
│   └── examples/        # Ví dụ sử dụng
│       └── ModalExample.tsx
├── stores/
│   └── modalStore.ts    # Zustand store cho modal
├── hooks/
│   └── useModal.ts      # Hook để sử dụng modal
└── package.json
```

## Sử dụng Components

Tất cả các component được export từ thư mục `components/ui/`. Bạn có thể import và sử dụng như sau:

```tsx
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiêu đề</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## Sử dụng Global Modal

Modal được quản lý bởi Zustand store, cho phép bạn gọi modal từ bất kỳ đâu trong ứng dụng:

```tsx
'use client'

import { useModal } from '@/hooks/useModal'
import { Button } from '@/components/ui/Button'

export default function MyComponent() {
  const { showModal, closeModal } = useModal()
  
  const handleClick = () => {
    showModal({
      title: 'Tiêu đề Modal',
      size: 'md', // 'sm' | 'md' | 'lg' | 'xl'
      content: (
        <div>
          <p>Nội dung modal của bạn</p>
          <Button onClick={closeModal}>Đóng</Button>
        </div>
      ),
      showCloseButton: true, // optional, default: true
      onClose: () => {
        // Callback khi modal đóng
        console.log('Modal đã đóng')
      },
    })
  }
  
  return <Button onClick={handleClick}>Mở Modal</Button>
}
```

### Modal Config Options

- `title?: string` - Tiêu đề modal (hiển thị ở header)
- `content: React.ReactNode` - Nội dung modal (bắt buộc)
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Kích thước modal (mặc định: 'md')
- `showCloseButton?: boolean` - Hiển thị nút đóng ở header (mặc định: true)
- `onClose?: () => void` - Callback khi modal đóng

## Build cho production

```bash
npm run build
npm start
```

