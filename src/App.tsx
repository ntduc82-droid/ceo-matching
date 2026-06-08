import { useState, useEffect } from 'react';
import { Member } from './types';
import { INITIAL_MEMBERS } from './data';
import IntroductionSection from './components/IntroductionSection';
import SearchSection from './components/SearchSection';
import ConnectionSection from './components/ConnectionSection';
import MemberDetailsModal from './components/MemberDetailsModal';
import MemberFormModal from './components/MemberFormModal';
import { motion } from 'motion/react';
import { Users, Search, Share2, HelpCircle } from 'lucide-react';
// @ts-ignore
import handshakeLogo from './assets/images/blue_handshake_logo_1780907314210.png';

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'intro' | 'search' | 'connect'>('intro');

  // Modal control states
  const [viedMember, setViewedMember] = useState<Member | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<Member | null>(null); // null if adding
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Synchronization with LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('memberhub_members');
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved members, reverting to initial data', e);
        setMembers(INITIAL_MEMBERS);
      }
    } else {
      setMembers(INITIAL_MEMBERS);
      localStorage.setItem('memberhub_members', JSON.stringify(INITIAL_MEMBERS));
    }
  }, []);

  const saveToLocalStorage = (updatedMembers: Member[]) => {
    setMembers(updatedMembers);
    localStorage.setItem('memberhub_members', JSON.stringify(updatedMembers));
  };

  // Member CRUD handlers
  const handleAddNewMemberClick = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEditMemberClick = (member: Member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleViewMemberClick = (member: Member) => {
    setViewedMember(member);
    setIsViewOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi cơ sở dữ liệu? Toàn bộ hồ sơ sẽ mất vĩnh viễn.')) {
      const updated = members.filter((m) => m.id !== id);
      saveToLocalStorage(updated);
    }
  };

  const handleSaveMember = (member: Member) => {
    let updated: Member[];
    const exists = members.some((m) => m.id === member.id);
    if (exists) {
      updated = members.map((m) => (m.id === member.id ? member : m));
    } else {
      updated = [member, ...members];
    }
    saveToLocalStorage(updated);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-150 font-sans flex flex-col">
      {/* Visual Navigation Bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border-2 border-neutral-800 shadow-lg shadow-blue-500/5">
              <img
                src={handshakeLogo}
                alt="Handshake Logo"
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-wider font-mono">CEO <span className="text-blue-500">MATCHING</span></h1>
              <p className="text-[10px] text-neutral-400 font-semibold tracking-wider">NÂNG TẦM GIÁ TRỊ</p>
            </div>
          </div>

          {/* Tab Button Selectors */}
          <nav className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            {/* Tab 1 */}
            <button
              id="tab-btn-intro"
              onClick={() => setActiveTab('intro')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'intro'
                  ? 'bg-neutral-900 text-blue-400 shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/55'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">1. Giới thiệu Thành viên</span>
              <span className="md:hidden">Giới thiệu</span>
            </button>

            {/* Tab 2 */}
            <button
              id="tab-btn-search"
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-neutral-900 text-emerald-400 shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/55'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">2. Tìm Thành viên</span>
              <span className="md:hidden">Tìm kiếm</span>
            </button>

            {/* Tab 3 */}
            <button
              id="tab-btn-connect"
              onClick={() => setActiveTab('connect')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'connect'
                  ? 'bg-neutral-900 text-amber-400 shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/55'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">3. Kết nối Đồng đội</span>
              <span className="md:hidden">Kết nối</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="content-container">
          {activeTab === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <IntroductionSection
                members={members}
                onAddClick={handleAddNewMemberClick}
                onEditClick={handleEditMemberClick}
                onViewClick={handleViewMemberClick}
                onDeleteClick={handleDeleteMember}
              />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchSection
                members={members}
                onViewClick={handleViewMemberClick}
              />
            </motion.div>
          )}

          {activeTab === 'connect' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ConnectionSection members={members} />
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer Branding block */}
      <footer className="bg-neutral-900/80 border-t border-neutral-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <p>© 2026 MEMBERSHIP PRO • Thiết kế Bento Grid sang trọng, tối giản.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-350 cursor-pointer">Điều khoản</span>
            <span className="hover:text-neutral-350 cursor-pointer">Bảo mật</span>
            <span className="hover:text-neutral-350 cursor-pointer">Hỗ trợ</span>
          </div>
        </div>
      </footer>

      {/* Modals mount point */}
      <MemberDetailsModal
        member={viedMember}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      <MemberFormModal
        member={editingMember}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveMember}
      />
    </div>
  );
}
