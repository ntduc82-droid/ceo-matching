import { useState } from 'react';
import { Member } from '../types';
import MemberCard from './MemberCard';
import { Users, Plus, Star, MapPin, Grid, Briefcase } from 'lucide-react';
import { DEPARTMENTS } from '../data';

interface IntroductionSectionProps {
  members: Member[];
  onAddClick: () => void;
  onEditClick: (member: Member) => void;
  onViewClick: (member: Member) => void;
  onDeleteClick: (id: string) => void;
}

export default function IntroductionSection({
  members,
  onAddClick,
  onEditClick,
  onViewClick,
  onDeleteClick,
}: IntroductionSectionProps) {
  const [activeDept, setActiveDept] = useState('Tất cả phòng ban');

  // Stats calculation
  const totalCount = members.length;
  const activeCount = members.filter((m) => m.status === 'active').length;
  const busyCount = members.filter((m) => m.status === 'busy').length;
  
  const uniqueLocations = Array.from(new Set(members.map((m) => m.location))).length;

  const filteredMembers = activeDept === 'Tất cả phòng ban' 
    ? members 
    : members.filter((m) => m.department === activeDept);

  return (
    <div id="intro-section" className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 p-6 rounded-3xl border border-neutral-850 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-blue-450" />
            <span>Giới thiệu & Quản trị Thành viên</span>
          </h2>
          <p className="text-neutral-400 text-sm">
            Nơi tập hợp, quản lý thông tin của các thành viên trong tổ chức. Bạn có thể thêm, sửa, xóa hoặc cập nhật trạng thái hoạt động của mỗi thành viên trong chế độ Bento Grid.
          </p>
        </div>
        
        <button
          id="btn-add-member-main"
          onClick={onAddClick}
          className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold rounded-xl px-5 py-3 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 self-start md:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thành viên</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-850 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tổng số lượng</p>
            <h4 className="text-2xl font-bold text-white tracking-tight mt-0.5">{totalCount}</h4>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-850 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Đang hoạt động</p>
            <h4 className="text-2xl font-bold text-white tracking-tight mt-0.5">{activeCount}</h4>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-850 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Đang bận việc</p>
            <h4 className="text-2xl font-bold text-white tracking-tight mt-0.5">{busyCount}</h4>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-850 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tỉnh thành</p>
            <h4 className="text-2xl font-bold text-white tracking-tight mt-0.5">{uniqueLocations}</h4>
          </div>
        </div>
      </div>

      {/* Category Tabs & Quick Search */}
      <div className="bg-neutral-950/80 p-1.5 rounded-2xl border border-neutral-850 flex flex-wrap gap-1 items-center">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            id={`tab-dept-${dept.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setActiveDept(dept)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeDept === dept
                ? 'bg-neutral-900 text-blue-400 shadow-md border border-neutral-800'
                : 'text-neutral-450 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* List Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id}>
              <MemberCard
                member={member}
                onView={onViewClick}
                onEdit={onEditClick}
                onDelete={onDeleteClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xl">
          <Grid className="w-12 h-12 text-neutral-650 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-white">Không tìm thấy thành viên</h3>
          <p className="text-neutral-400 text-xs mt-1">
            Không có thành viên nào thuộc phòng ban <strong>{activeDept}</strong>. Hãy thử tạo mới thành viên vào phòng ban này xem sao nhé!
          </p>
          <button
            id="btn-add-member-empty"
            onClick={onAddClick}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm thành viên mới</span>
          </button>
        </div>
      )}
    </div>
  );
}
