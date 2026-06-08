import { useState, useMemo } from 'react';
import { Member } from '../types';
import { Search, MapPin, Grid, Briefcase, RefreshCw, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { DEPARTMENTS, LOCATIONS } from '../data';

interface SearchSectionProps {
  members: Member[];
  onViewClick: (member: Member) => void;
}

export default function SearchSection({ members, onViewClick }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả phòng ban');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả địa điểm');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Extract all unique skills across all members dynamically
  const availableSkills = useMemo(() => {
    const allSkills = members.flatMap((m) => m.skills);
    return Array.from(new Set(allSkills)).sort();
  }, [members]);

  const toggleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('Tất cả phòng ban');
    setSelectedLocation('Tất cả địa điểm');
    setSelectedStatus('all');
    setSelectedSkills([]);
    setSortBy('name-asc');
  };

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Search bar matching
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(query) ||
          m.role.toLowerCase().includes(query) ||
          m.bio.toLowerCase().includes(query) ||
          m.skills.some((s) => s.toLowerCase().includes(query)) ||
          m.interests.some((i) => i.toLowerCase().includes(query))
      );
    }

    // Department match
    if (selectedDept !== 'Tất cả phòng ban') {
      result = result.filter((m) => m.department === selectedDept);
    }

    // Location match
    if (selectedLocation !== 'Tất cả địa điểm') {
      result = result.filter((m) => m.location === selectedLocation);
    }

    // Status match
    if (selectedStatus !== 'all') {
      result = result.filter((m) => m.status === selectedStatus);
    }

    // Skill list matches
    if (selectedSkills.length > 0) {
      result = result.filter((m) =>
        selectedSkills.every((skill) => m.skills.includes(skill))
      );
    }

    // Sorting block
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName, 'vi');
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName, 'vi');
        case 'date-newest':
          return b.joinedDate.localeCompare(a.joinedDate);
        case 'date-oldest':
          return a.joinedDate.localeCompare(b.joinedDate);
        default:
          return 0;
      }
    });

    return result;
  }, [members, searchTerm, selectedDept, selectedLocation, selectedStatus, selectedSkills, sortBy]);

  const getStatusBadge = (status: Member['status']) => {
    switch (status) {
      case 'active':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />;
      case 'busy':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />;
      case 'inactive':
        return <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />;
    }
  };

  return (
    <div id="search-section" className="space-y-6">
      {/* Intro block */}
      <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-850 shadow-xl space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="w-5.5 h-5.5 text-emerald-400" />
          <span>Tìm kiếm Thành viên Ưu tú</span>
        </h2>
        <p className="text-neutral-400 text-sm">
          Sử dụng bộ lọc thông minh theo phòng ban, địa điểm, trạng thái hoặc chọn trực tiếp các nhãn kỹ năng để nhanh chóng tìm thấy nhân tố phù hợp cho dự án của bạn trong giao diện Bento.
        </p>
      </div>

      {/* Main Filter & search widget */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-850 shadow-lg overflow-hidden">
        <div className="p-5 border-b border-neutral-800 bg-neutral-950/40">
          <div className="flex items-center gap-2 text-neutral-300 font-bold mb-4 text-sm">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Bộ lọc tìm kiếm nâng cao</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-12 lg:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-500" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Nhập tên, kỹ năng, vị trí hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-550/20 focus:border-emerald-500 transition-all placeholder:text-neutral-550"
              />
            </div>

            {/* Department selector */}
            <div className="md:col-span-4 lg:col-span-2.5">
              <select
                id="select-dept"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-550/20 focus:border-emerald-500 transition-all"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-neutral-950 text-neutral-200">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Selector */}
            <div className="md:col-span-4 lg:col-span-2.5">
              <select
                id="select-location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-550/20 focus:border-emerald-500 transition-all"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-neutral-950 text-neutral-200">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Status selector */}
            <div className="md:col-span-4 lg:col-span-3">
              <select
                id="select-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-550/20 focus:border-emerald-500 transition-all"
              >
                <option value="all" className="bg-neutral-950 text-neutral-200">Tất cả trạng thái</option>
                <option value="active" className="bg-neutral-950 text-neutral-200">Đang hoạt động</option>
                <option value="busy" className="bg-neutral-950 text-neutral-200">Đang bận</option>
                <option value="inactive" className="bg-neutral-950 text-neutral-200">Ngoại tuyến</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Skill Cloud filters */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-950/20 space-y-3">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Lọc chính xác theo nhãn Kỹ năng ({availableSkills.length})
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-2">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold border transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                      : 'bg-neutral-900 text-neutral-450 border-neutral-800 hover:bg-neutral-850 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lower Utility row: sort, reset, status report */}
        <div className="p-3.5 bg-neutral-950/60 border-t border-neutral-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-450">
          <div className="flex items-center gap-2">
            <span>Hiển thị: <strong>{filteredMembers.length}</strong> trên tổng số <strong>{members.length}</strong> thành viên</span>
            {selectedSkills.length > 0 && (
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-lg font-semibold">
                Đã tuyển {selectedSkills.length} kỹ năng
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 py-1 px-2.5 rounded-lg font-semibold focus:outline-none"
              >
                <option value="name-asc">Tên (A → Z)</option>
                <option value="name-desc">Tên (Z → A)</option>
                <option value="date-newest">Mới tham gia nhất</option>
                <option value="date-oldest">Thành viên kỳ cựu</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-neutral-400 hover:text-emerald-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Grid of matches */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-neutral-900 hover:bg-neutral-950/40 rounded-3xl border border-neutral-850 shadow-md p-5 flex flex-col justify-between group hover:border-emerald-500/30 hover:shadow-[0_4px_24px_rgba(16,185,129,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Corner Badge Location */}
              <div className="absolute top-4 right-4 text-[10px] text-neutral-400 font-bold flex items-center gap-0.5 bg-neutral-950 px-2.5 py-0.5 rounded-lg border border-neutral-850">
                <MapPin className="w-3 h-3 text-neutral-500" />
                <span>{member.location}</span>
              </div>

              <div>
                {/* Avatar / Status */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-800"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.fullName)}`;
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-neutral-900 rounded-full">
                      {getStatusBadge(member.status)}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm truncate">
                      {member.fullName}
                    </h4>
                    <p className="text-[11px] text-neutral-450 font-semibold truncate">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Subtitle / Department info */}
                <div className="mt-4 text-[11px] text-neutral-300 font-bold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-805 text-neutral-400">{member.department}</span>
                </div>

                {/* Long Bio */}
                <p className="text-neutral-400 text-xs italic mt-3 line-clamp-2">
                  &ldquo;{member.bio}&rdquo;
                </p>
              </div>

              {/* Bottom strip skill badges and click action */}
              <div className="mt-4 pt-3.5 border-t border-neutral-800/80 flex items-center justify-between gap-1">
                {/* Skills aligned */}
                <div className="flex flex-wrap gap-1 max-w-[150px] overflow-hidden">
                  {member.skills.slice(0, 2).map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                        selectedSkills.includes(skill)
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-neutral-950 text-neutral-450 border border-neutral-805'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 2 && (
                    <span className="text-[10px] text-neutral-500 self-center font-mono pl-1">
                      +{member.skills.length - 2}
                    </span>
                  )}
                </div>

                <button
                  id={`btn-search-view-${member.id}`}
                  onClick={() => onViewClick(member)}
                  className="px-3 py-1.5 bg-neutral-950 hover:bg-emerald-600 hover:text-white rounded-xl text-neutral-300 text-xs font-bold border border-neutral-800 hover:border-emerald-650 transition-all flex-shrink-0 cursor-pointer"
                >
                  Hồ sơ
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-12 text-center max-w-sm mx-auto shadow-xl">
          <Grid className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-white">Không tìm thấy kết quả</h3>
          <p className="text-neutral-450 text-xs mt-1.5 leading-relaxed">
            Chúng tôi không tìm thấy thành viên nào khớp với cấu hình bộ lọc của bạn hiện tại. Hãy thử giảm bớt các nhãn kỹ năng đã chọn hoặc tối giản hóa thanh tìm kiếm.
          </p>
          <button
            id="btn-reset-empty-search"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 mx-auto cursor-pointer shadow-md shadow-emerald-500/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Xóa bỏ tất cả bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  );
}
