import { Member } from '../types';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, Award, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberDetailsModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberDetailsModal({ member, isOpen, onClose }: MemberDetailsModalProps) {
  if (!member) return null;

  const getStatusStyle = (status: Member['status']) => {
    switch (status) {
      case 'active':
        return { text: 'Đang hoạt động', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-990/30' };
      case 'busy':
        return { text: 'Đang bận', color: 'text-amber-400 bg-amber-500/10 border-amber-990/30' };
      case 'inactive':
        return { text: 'Ngoại tuyến', color: 'text-neutral-400 bg-neutral-950 border-neutral-800' };
      default:
        return { text: 'Không rõ', color: 'text-neutral-400 bg-neutral-950 border-neutral-800' };
    }
  };

  const statusInfo = getStatusStyle(member.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="details-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-neutral-950 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-neutral-850"
          >
            {/* Header ACCENT Gradient Bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"></div>

            {/* Action Header bar */}
            <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-450 uppercase tracking-widest bg-neutral-900 px-3 py-1 rounded-md">HỒ SƠ THÀNH VIÊN // Member Profile</span>
              <button
                id="btn-close-details"
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-900 rounded-full transition-colors text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto space-y-6">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <img
                  id={`details-avatar-${member.id}`}
                  src={member.avatar}
                  alt={member.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-neutral-800 shadow-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.fullName)}&backgroundColor=1c1917&color=f59e0b`;
                  }}
                />

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h2 className="text-2xl font-black text-white tracking-tight">{member.fullName}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-neutral-900 ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <p className="text-amber-400 font-bold text-sm tracking-wide flex justify-center sm:justify-start items-center gap-1.5 uppercase font-mono">
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    <span>{member.role}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-neutral-300">
                    <span className="bg-neutral-900 px-2.5 py-1 rounded-lg font-bold text-amber-400 border border-neutral-800">
                      Bộ phận: {member.department}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-neutral-400 bg-neutral-900/50 px-2 py-1 rounded-lg border border-neutral-920">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {member.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-850">
                <h4 className="font-bold text-amber-450 font-mono text-[10px] uppercase tracking-wider mb-2">Giới thiệu bản thân // BIO</h4>
                <p className="text-neutral-300 italic text-xs leading-relaxed">
                  &ldquo;{member.bio}&rdquo;
                </p>
              </div>

              {/* Specific Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact information */}
                <div className="border border-neutral-850 bg-neutral-950/40 rounded-2xl p-4.5 space-y-3 shadow-md">
                  <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono border-b border-neutral-900 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-2 text-xs text-neutral-400 font-medium">
                    <p className="flex items-center gap-2.5 min-w-0">
                      <Mail className="w-4 h-4 text-neutral-550 flex-shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-amber-450 truncate transition-colors font-mono">{member.email}</a>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-neutral-550 flex-shrink-0" />
                      <a href={`tel:${member.phone}`} className="hover:text-amber-450 transition-colors font-mono">{member.phone}</a>
                    </p>
                  </div>
                </div>

                {/* Integration Details */}
                <div className="border border-neutral-850 bg-neutral-950/40 rounded-2xl p-4.5 space-y-3 shadow-md">
                  <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono border-b border-neutral-900 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Dữ liệu hoạt động
                  </h4>
                  <div className="space-y-2 text-xs text-neutral-400 font-medium font-mono">
                    <p className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-neutral-550 flex-shrink-0" />
                      <span>Tham gia: {member.joinedDate}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-neutral-550 flex-shrink-0" />
                      <span>ID: {member.id}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Award className="w-4 h-4 text-amber-500" />
                  Kỹ năng chuyên môn // Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-neutral-900 text-neutral-300 border border-neutral-805 rounded-xl text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Sở thích cá nhân // Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.interests.map((interest, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-neutral-900 text-pink-400 border border-pink-950/20 rounded-xl text-xs font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-neutral-900 bg-neutral-950 flex justify-end">
              <button
                id="btn-close-details-footer"
                onClick={onClose}
                className="px-5 py-2 hover:bg-neutral-850 bg-neutral-900 text-white font-semibold rounded-xl border border-neutral-800 transition-all text-xs cursor-pointer"
              >
                Đóng hồ sơ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
