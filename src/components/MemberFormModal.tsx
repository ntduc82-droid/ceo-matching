import { useState, useEffect, FormEvent } from 'react';
import { Member } from '../types';
import { X, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEPARTMENTS, LOCATIONS } from '../data';

interface MemberFormModalProps {
  member: Member | null; // null if Adding, Member object if Editing
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
}

export default function MemberFormModal({ member, isOpen, onClose, onSave }: MemberFormModalProps) {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [interestsText, setInterestsText] = useState('');
  const [status, setStatus] = useState<Member['status']>('active');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load member details if editing
  useEffect(() => {
    if (member) {
       setFullName(member.fullName);
       setRole(member.role);
       setDepartment(member.department);
       setEmail(member.email);
       setPhone(member.phone);
       setBio(member.bio);
       setSkillsText(member.skills.join(', '));
       setInterestsText(member.interests.join(', '));
       setStatus(member.status);
       setLocation(member.location);
       setAvatar(member.avatar);
    } else {
       // Clear for new entry
       setFullName('');
       setRole('');
       setDepartment(DEPARTMENTS[1] || 'Công nghệ thông tin');
       setEmail('');
       setPhone('');
       setBio('');
       setSkillsText('');
       setInterestsText('');
       setStatus('active');
       setLocation(LOCATIONS[1] || 'Hà Nội');
       setAvatar('');
    }
    setErrorMsg('');
  }, [member, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !role.trim() || !email.trim() || !phone.trim() || !bio.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Email không đúng định dạng.');
      return;
    }

    // Process comma separated text into trimmed arrays
    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
      
    const interests = interestsText
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (skills.length === 0) {
      setErrorMsg('Vui lòng nhập ít nhất 1 kỹ năng chuyên môn.');
      return;
    }

    // Generate random portrait avatar URL if empty
    let finalAvatar = avatar.trim();
    if (!finalAvatar) {
      // Choose a standard fallback random portrait style
      const randomSeed = Math.floor(Math.random() * 100);
      const gender = Math.random() > 0.5 ? 'men' : 'women';
      finalAvatar = `https://randomuser.me/api/portraits/${gender}/${randomSeed}.jpg`;
    }

    const savedMember: Member = {
      id: member ? member.id : `mb-${Date.now()}`,
      fullName: fullName.trim(),
      role: role.trim(),
      department: department || DEPARTMENTS[1],
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      skills,
      interests: interests.length > 0 ? interests : ['Học hỏi', 'Phát triển'],
      avatar: finalAvatar,
      status,
      joinedDate: member ? member.joinedDate : new Date().toISOString().split('T')[0],
      location: location || LOCATIONS[1],
    };

    onSave(savedMember);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="form-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Form Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-neutral-950 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-neutral-850"
        >
          {/* Header Accent Accent line */}
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"></div>

          <div className="p-5 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between">
            <h3 className="font-black text-white text-base flex items-center gap-2 uppercase tracking-tight font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              {member ? 'CẬP NHẬT THÀNH VIÊN // Update' : 'THÊM THÀNH VIÊN MỚI // Add'}
            </h3>
            <button
              id="btn-close-form"
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-900 rounded-full transition-colors text-neutral-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-neutral-955">
            {errorMsg && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-900 rounded-xl text-rose-350 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Inputs Group 1: General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Họ và tên <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Chức danh nghề nghiệp <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kỹ sư Phần mềm Senior"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Selects: Department, Location, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Ban / Phòng
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {DEPARTMENTS.filter(d => d !== 'Tất cả phòng ban').map((dept) => (
                    <option key={dept} value={dept} className="bg-neutral-950 text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Địa điểm hoạt động
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {LOCATIONS.filter(l => l !== 'Tất cả địa điểm').map((loc) => (
                    <option key={loc} value={loc} className="bg-neutral-950 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Member['status'])}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="active" className="bg-neutral-950 text-emerald-400 font-bold">Đang hoạt động</option>
                  <option value="busy" className="bg-neutral-950 text-amber-400 font-bold">Đang bận</option>
                  <option value="inactive" className="bg-neutral-950 text-neutral-400 font-bold">Ngoại tuyến</option>
                </select>
              </div>
            </div>

            {/* Contacts: Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Địa chỉ Email <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="vande@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Số điện thoại <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Avatar URL / Image link */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                Đường dẫn ảnh đại diện (Avatar URL)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... (Bỏ trống để tự động tạo)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Khuyên dùng ảnh chân dung từ Unsplash, Gravatar hoặc để trống để sinh ngẫu nhiên chân dung nhân sự chất lượng cao.
              </span>
            </div>

            {/* Skills & Interests Comma lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Kỹ năng chuyên môn <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ngăn cách bằng dấu phẩy, vd: React, Figma, SQL"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">Tối thiểu 1 kỹ năng chính</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                  Sở thích / Đam mê
                </label>
                <input
                  type="text"
                  placeholder="Ngăn cách bằng dấu phẩy, vd: Đọc sách, Chạy bộ, Guitar"
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">Hỗ trợ thuật toán ghép đôi kết nối tối ưu</span>
              </div>
            </div>

            {/* Bio statement */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                Tiểu sử bản thân / Châm ngôn làm việc <span className="text-amber-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Mô tả tóm tắt kinh nghiệm làm việc, định hướng đóng góp và kết nối cá nhân..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900/60 text-white placeholder:text-neutral-550 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
              />
            </div>
          </form>

          {/* Footer controls */}
          <div className="p-4 border-t border-neutral-900 bg-neutral-950 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:bg-neutral-850 bg-neutral-900 rounded-xl transition-all text-xs font-bold border border-neutral-800 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              id="btn-save-member"
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-950 stroke-[3]" />
              <span>{member ? 'Cập nhật' : 'Thêm mới'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
