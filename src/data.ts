import { Member } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mb-1',
    fullName: 'Nguyễn Văn Nam',
    role: 'Kỹ sư Frontend (React/TypeScript)',
    department: 'Công nghệ thông tin',
    email: 'nam.nguyen@company.com',
    phone: '0912 345 678',
    bio: 'Đam mê xây dựng giao diện người dùng tối giản, tốc độ cao và tối ưu trải nghiệm. Có hơn 4 năm kinh nghiệm làm việc với hệ sinh thái React, TailwindCSS và hệ thống thiết kế (Design System).',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js', 'Redux'],
    interests: ['Chụp ảnh phong cảnh', 'Đọc sách tài chính', 'Chạy bộ', 'Cà phê phin'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    joinedDate: '2022-03-15',
    location: 'Hà Nội'
  },
  {
    id: 'mb-2',
    fullName: 'Trần Thị Mai',
    role: 'Chuyên viên Marketing & Content SEO',
    department: 'Tiếp thị & Truyền thông',
    email: 'mai.tran@company.com',
    phone: '0987 654 321',
    bio: 'Chuyên gia xây dựng nội dung thương hiệu và tối ưu hóa thứ hạng tìm kiếm. Có kinh nghiệm dẫn dắt các chiến dịch truyền thông kỹ thuật số tiếp cận hơn 500,000 người dùng hàng tháng.',
    skills: ['Content Strategy', 'SEO', 'Google Analytics', 'Copywriting', 'Social Media'],
    interests: ['Viết blog', 'Du lịch bụi', 'Yoga', 'Mèo'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    joinedDate: '2023-01-10',
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: 'mb-3',
    fullName: 'Phạm Hoàng Long',
    role: 'Thiết kế Trải nghiệm Người dùng (UI/UX)',
    department: 'Thiết kế',
    email: 'long.pham@company.com',
    phone: '0933 111 222',
    bio: 'Không ngừng tìm tòi sự cân đối giữa thẩm mỹ thị giác và tính khả dụng của sản phẩm số. Tin rằng thiết kế tuyệt vời là thiết kế vô hình nhưng mang lại cảm xúc bền vững.',
    skills: ['Figma', 'System Design', 'User Research', 'Prototyping', 'Illustrator'],
    interests: ['Vẽ phác thảo', 'Nhạc không lời', 'Nấu ăn', 'Board game'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    status: 'busy',
    joinedDate: '2022-09-01',
    location: 'Đà Nẵng'
  },
  {
    id: 'mb-4',
    fullName: 'Lê Minh Triết',
    role: 'Kỹ sư Backend & Kiến trúc sư Đám mây',
    department: 'Công nghệ thông tin',
    email: 'triet.le@company.com',
    phone: '0905 888 999',
    bio: 'Tập trung xây dựng các kiến trúc hệ thống backend hiệu năng cao, bảo mật chặt chẽ bằng Node.js, Go và cơ sở dữ liệu lớn. Chuyên gia tự động hóa quy trình CI/CD.',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes'],
    interests: ['Lập trình mã nguồn mở', 'Chơi guitar', 'Leo núi', 'Nuôi chó'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    joinedDate: '2021-06-20',
    location: 'Hà Nội'
  },
  {
    id: 'mb-5',
    fullName: 'Hoàng Thanh Hương',
    role: 'Quản lý Nhân sự & Gắn kết Văn hóa',
    department: 'Hành chính & Nhân sự',
    email: 'huong.hoang@company.com',
    phone: '0966 555 444',
    bio: 'Tập trung xây dựng tài nguyên con người và phát triển văn hóa doanh nghiệp lành mạnh, nơi mỗi cá nhân đều có cơ hội phát triển tối đa tiềm năng và cảm thấy thuộc về tổ chức.',
    skills: ['Recruitment', 'Conflict Resolution', 'Employee Engagement', 'HR Strategy'],
    interests: ['Học ngôn ngữ mới', 'Cắm hoa', 'Thiền', 'Bánh ngọt'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    joinedDate: '2023-05-08',
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: 'mb-6',
    fullName: 'Vũ Anh Tuấn',
    role: 'Trưởng phòng Phát triển Thị trường',
    department: 'Kinh doanh',
    email: 'tuan.vu@company.com',
    phone: '0922 777 666',
    bio: 'Hơn 6 năm dẫn dắt bộ phận kinh doanh chinh phục các thị trường tiềm năng mới, thương lượng các hợp đồng lớn và duy trì mối quan hệ đối tác bền chặt lâu năm.',
    skills: ['B2B Sales', 'Negotiation', 'Market Research', 'CRM', 'Public Speaking'],
    interests: ['Đánh golf', 'Xem phim trinh thám', 'Sưu tầm đồng hồ', 'Bơi lội'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    joinedDate: '2020-11-12',
    location: 'Hà Nội'
  },
  {
    id: 'mb-7',
    fullName: 'Đào Phương Linh',
    role: 'Quản lý Sản phẩm (Lead Product Manager)',
    department: 'Sản phẩm',
    email: 'linh.dao@company.com',
    phone: '0911 222 333',
    bio: 'Cầu nối giữa chiến lược kinh doanh, tầm nhìn công nghệ và nghệ thuật thiết kế để tạo ra những sản phẩm đóng góp giá trị thực cho người dùng cuối.',
    skills: ['Agile/Scrum', 'Product Strategy', 'Data-driven Decisions', 'Roadmapping'],
    interests: ['Vẽ tranh màu nước', 'Khám phá quán cà phê cổ', 'Chạy bộ', 'Kịch nói'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    status: 'busy',
    joinedDate: '2022-01-20',
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: 'mb-8',
    fullName: 'Bùi Gia Huy',
    role: 'Chuyên viên Tư vấn & Trải nghiệm Khánh hàng',
    department: 'Kinh doanh',
    email: 'huy.bui@company.com',
    phone: '0944 555 666',
    bio: 'Luôn lắng nghe khách hàng với tấm lòng chân thành nhất để tìm phương án giải quyết dứt điểm các vướng mắc, gia tăng tỷ lệ giữ chân khách hàng (NPS > 90).',
    skills: ['Customer Support', 'Feedback Analysis', 'Troubleshooting', 'CRM Software'],
    interests: ['Đá bóng', 'Xem giải Ngoại hạng Anh', 'Đồ công nghệ', 'Lắp ráp Lego'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
    status: 'inactive',
    joinedDate: '2023-08-15',
    location: 'Đà Nẵng'
  }
];

export const DEPARTMENTS = [
  'Tất cả phòng ban',
  'Công nghệ thông tin',
  'Tiếp thị & Truyền thông',
  'Thiết kế',
  'Hành chính & Nhân sự',
  'Kinh doanh',
  'Sản phẩm'
];

export const LOCATIONS = [
  'Tất cả địa điểm',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng'
];
