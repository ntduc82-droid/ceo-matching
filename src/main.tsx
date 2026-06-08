import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
// 1. Đọc file dữ liệu menu.json được tạo ra từ Admin CMS
// @ts-ignore
import menuData from '../data/menu.json';

// Định nghĩa cấu trúc dữ liệu để React/TypeScript không báo lỗi
interface MenuItem {
  label: string;
  link: string;
}

// Hàm tự động vẽ menu ra giao diện HTML sau khi trang tải xong
const renderMenu = () => {
  const mainMenuContainer = document.getElementById('main-menu');

  if (mainMenuContainer && menuData && Array.isArray(menuData.menu_items)) {
    let menuHtml = '';
    
    // 2. Duyệt qua danh sách menu bạn đã cấu hình trong Admin
    (menuData.menu_items as MenuItem[]).forEach((item: MenuItem) => {
      menuHtml += `<li><a href="${item.link}" class="hover:text-amber-500 transition-colors">${item.label}</a></li>`;
    });
    
    // 3. Đổ dữ liệu vào thẻ ul có id="main-menu"
    mainMenuContainer.innerHTML = menuHtml;
  }
};

// Chạy hàm vẽ menu ngay khi hệ thống load xong
if (typeof window !== 'undefined') {
  renderMenu();
}