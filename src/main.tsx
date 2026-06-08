import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
// 1. Đọc file dữ liệu menu.json từ Admin CMS
// @ts-ignore
import menuData from '../data/menu.json';

// Định nghĩa cấu trúc dữ liệu cho chuẩn TypeScript
interface MenuItem {
  label: string;
  link: string;
}

// Sử dụng sự kiện DOMContentLoaded để đảm bảo thẻ HTML đã tải xong
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Ép kiểu cụ thể cho h2/ul là HTMLUListElement để không bị báo đỏ lỗi innerHTML
    const mainMenuContainer = document.getElementById('main-menu') as HTMLUListElement | null;

    if (mainMenuContainer && menuData && Array.isArray(menuData.menu_items)) {
      let menuHtml = '';
      
      // 2. Duyệt qua danh sách menu bạn đã cấu hình
      (menuData.menu_items as MenuItem[]).forEach((item: MenuItem) => {
        menuHtml += `<li><a href="${item.link}" class="hover:text-amber-500 transition-colors">${item.label}</a></li>`;
      });
      
      // 3. Đổ dữ liệu vào thẻ ul
      mainMenuContainer.innerHTML = menuHtml;
    }
  });
}