import { Member } from '../types';
import { Mail, Phone, MapPin, Briefcase, Eye, Edit, Trash2 } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export default function MemberCard({ member, onView, onEdit, onDelete }: MemberCardProps) {
  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
      case 'busy':
        return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
      case 'inactive':
        return 'bg-neutral-500';
      default:
        return 'bg-neutral-600';
    }
  };

  const getStatusText = (status: Member['status']) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'busy':
        return 'Đang bận';
      case 'inactive':
        return 'Ngoại tuyến';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div 
      id={`member-card-${member.id}`} 
      className="bg-neutral-900 rounded-3xl border border-neutral-850 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-neutral-700 transition-all duration-300 overflow-hidden flex flex-col group h-full"
    >
      {/* Top Banner Accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600"></div>
      
      <div className="p-6 flex-1 flex flex-col">
        {/* Header containing Avatar & Quick Details */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              id={`avatar-${member.id}`}
              src={member.avatar} 
              alt={member.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-800 group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Failback if Unsplash has issues
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.fullName)}`;
              }}
            />
            <span 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900 ${getStatusColor(member.status)}`}
              title={getStatusText(member.status)}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg leading-snug hover:text-blue-400 transition-colors truncate">
              {member.fullName}
            </h3>
            <p className="text-neutral-450 text-xs font-medium flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
              <span className="truncate">{member.role}</span>
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-950 text-blue-400 border border-neutral-800">
              {member.department}
            </span>
          </div>
        </div>

        {/* Bio segment */}
        <p className="text-neutral-350 text-xs mt-4 line-clamp-2 flex-grow italic leading-relaxed">
          &ldquo;{member.bio}&rdquo;
        </p>

        {/* Info segments */}
        <div className="space-y-2 mt-4 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <span>{member.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
        </div>

        {/* Skills preview limited to 3 items */}
        <div className="flex flex-wrap gap-1 mt-4">
          {member.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-0.5 text-[10px] font-mono text-neutral-450 bg-neutral-950 border border-neutral-800 rounded-md"
            >
              #{skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] text-neutral-550 bg-neutral-950 rounded-md border border-neutral-800">
              +{member.skills.length - 3} khác
            </span>
          )}
        </div>
      </div>

      {/* Button controls strip */}
      <div className="bg-neutral-950/60 px-6 py-3 border-t border-neutral-800/60 flex items-center justify-between gap-2">
        <button
          id={`btn-view-${member.id}`}
          onClick={() => onView(member)}
          className="text-neutral-300 hover:text-blue-400 p-1.5 hover:bg-neutral-900 rounded-lg border border-transparent hover:border-neutral-850 transition-all text-xs flex items-center gap-1 font-semibold cursor-pointer"
          title="Xem chi tiết"
        >
          <Eye className="w-4 h-4 text-neutral-400" />
          <span>Chi tiết</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            id={`btn-edit-${member.id}`}
            onClick={() => onEdit(member)}
            className="text-neutral-400 hover:text-amber-400 p-1.5 hover:bg-neutral-900 rounded-lg border border-transparent hover:border-neutral-850 transition-all text-xs cursor-pointer"
            title="Sửa thành viên"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            id={`btn-delete-${member.id}`}
            onClick={() => onDelete(member.id)}
            className="text-neutral-400 hover:text-rose-500 p-1.5 hover:bg-neutral-900 rounded-lg border border-transparent hover:border-neutral-850 transition-all text-xs cursor-pointer"
            title="Xóa thành viên"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
