import { useState, useMemo, useEffect, useRef, FormEvent } from 'react';
import { Member, Connection, Message } from '../types';
import { Users, AlertCircle, Share2, Sparkles, Send, Check, X, MessageSquare, Flame, HelpCircle } from 'lucide-react';

interface ConnectionSectionProps {
  members: Member[];
}

export default function ConnectionSection({ members }: ConnectionSectionProps) {
  // Connections state - Prepopulate a couple of connections
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'conn-1',
      fromId: 'mb-1', // Nguyen Van Nam
      toId: 'mb-4', // Le Minh Triet
      status: 'connected',
      message: 'Chào Triết, anh thấy em làm việc trên hệ thống Backend rất tốt. Anh em mình có thể kết nối để phát triển các dự án Fullstack nhé!',
      timestamp: '2026-06-05T09:00:00Z',
    },
    {
      id: 'conn-2',
      fromId: 'mb-2', // Tran Thi Mai
      toId: 'mb-3', // Pham Hoang Long
      status: 'connected',
      message: 'Hi Long, mình muốn trao đổi về ý tưởng tối ưu giao diện cho trang chiến dịch sắp tới.',
      timestamp: '2026-06-06T14:30:00Z',
    },
    {
      id: 'conn-3',
      fromId: 'mb-6', // Vu Anh Tuan
      toId: 'mb-7', // Dao Phuong Linh
      status: 'pending',
      message: 'Anh chào Linh, bên bộ phận Kinh doanh đang có dữ liệu phản hồi cực tốt từ thị trường cho tính năng mới. Anh muốn bàn thảo lộ trình sản phẩm.',
      timestamp: '2026-06-07T10:15:00Z',
    },
  ]);

  // Messages state - Prepopulate conversational messages for Connected pairs
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      connectionId: 'conn-1',
      senderId: 'mb-1',
      text: 'Chào Triết, anh thấy em làm việc trên hệ thống Backend rất tốt. Anh em mình có thể kết nối để phát triển các dự án Fullstack nhé!',
      timestamp: '2026-06-05T09:00:00Z',
    },
    {
      id: 'msg-2',
      connectionId: 'conn-1',
      senderId: 'mb-4',
      text: 'Vâng em chào anh Nam! Quá tuyệt vời anh ơi. Em cũng đang tìm một anh làm Frontend cứng để tối ưu hóa UI/UX cho trang quản trị Admin hệ thống.',
      timestamp: '2026-06-05T09:05:00Z',
    },
    {
      id: 'msg-3',
      connectionId: 'conn-2',
      senderId: 'mb-2',
      text: 'Hi Long, mình muốn trao đổi về ý tưởng tối ưu giao diện cho trang chiến dịch sắp tới.',
      timestamp: '2026-06-06T14:30:00Z',
    },
    {
      id: 'msg-4',
      connectionId: 'conn-2',
      senderId: 'mb-3',
      text: 'Chào Mai nha! Ý kiến hay đó, mình rảnh vào chiều mai. Mai gửi trước cho mình các từ khóa chính cần làm nổi bật nhé.',
      timestamp: '2026-06-06T15:00:00Z',
    },
  ]);

  // Compatibility Matcher state
  const [matchIdA, setMatchIdA] = useState<string>(members[0]?.id || '');
  const [matchIdB, setMatchIdB] = useState<string>(members[1]?.id || '');

  // Connection Request Creation state
  const [reqSenderId, setReqSenderId] = useState<string>(members[0]?.id || '');
  const [reqReceiverId, setReqReceiverId] = useState<string>(members[1]?.id || '');
  const [reqMessage, setReqMessage] = useState<string>('');
  const [createReport, setCreateReport] = useState<{ status: 'success' | 'error'; msg: string } | null>(null);

  // Active Chat State
  const [activeConnectionId, setActiveConnectionId] = useState<string>('');
  const [chatSenderId, setChatSenderId] = useState<string>('');
  const [chatText, setChatText] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Set default active chatbot connection if there is one
  useEffect(() => {
    const connectedArr = connections.filter((c) => c.status === 'connected');
    if (connectedArr.length > 0 && !activeConnectionId) {
      setActiveConnectionId(connectedArr[0].id);
      setChatSenderId(connectedArr[0].fromId);
    }
  }, [connections, activeConnectionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConnectionId]);

  // Compute Active Chat Info
  const activeChatDetails = useMemo(() => {
    if (!activeConnectionId) return null;
    const conn = connections.find((c) => c.id === activeConnectionId);
    if (!conn) return null;

    const mFrom = members.find((m) => m.id === conn.fromId);
    const mTo = members.find((m) => m.id === conn.toId);
    if (!mFrom || !mTo) return null;

    // The other participant in the chat
    const self = mFrom.id === chatSenderId ? mFrom : mTo;
    const partner = mFrom.id === chatSenderId ? mTo : mFrom;

    const chatHistory = messages.filter((m) => m.connectionId === activeConnectionId);

    return {
      conn,
      self,
      partner,
      chatHistory,
    };
  }, [activeConnectionId, connections, messages, members, chatSenderId]);

  // Compatibility calculation between selected candidates A and B
  const compatibilityResult = useMemo(() => {
    if (!matchIdA || !matchIdB || matchIdA === matchIdB) return null;
    const memberA = members.find((m) => m.id === matchIdA);
    const memberB = members.find((m) => m.id === matchIdB);
    if (!memberA || !memberB) return null;

    // Overlapping skills
    const overlapSkills = memberA.skills.filter((s) => memberB.skills.includes(s));

    // Common interests
    const commonInterests = memberA.interests.filter((i) => memberB.interests.includes(i));

    // Base score calculation
    let baseScore = 50;

    // Add score for shared skills
    baseScore += overlapSkills.length * 8;

    // Add score for common interests
    baseScore += commonInterests.length * 5;

    // Cross department synergistic combinations check
    const depts = [memberA.department, memberB.department];
    let synergyType = 'Hợp tác chung';
    let synergyDesc = '';

    if (depts.includes('Công nghệ thông tin') && depts.includes('Thiết kế')) {
      baseScore += 20;
      synergyType = 'Kiến tạo Sản phẩm Đỉnh cao (UI/UX + Frontend)';
      synergyDesc = `Sự kết hợp hoàn hảo giữa thẩm mỹ thị giác tinh tế của ${
        memberA.department === 'Thiết kế' ? memberA.fullName : memberB.fullName
      } và năng lực hiện thực hóa mã nguồn giao diện sắc sảo của ${
        memberA.department === 'Công nghệ thông tin' ? memberA.fullName : memberB.fullName
      }. Đảm bảo tạo nên giao diện sản phẩm siêu mượt, nhất quán tuyệt đối giữa bản vẽ và thực tế.`;
    } else if (depts.includes('Công nghệ thông tin') && depts.includes('Sản phẩm')) {
      baseScore += 18;
      synergyType = 'Chiến lược & Công nghệ Thực thi';
      synergyDesc = `Kiến trúc hoạch định lộ trình chức năng rõ ràng của Quản lý Sản phẩm phối hợp chặt chẽ trực tiếp với Khả năng lập trình phân tích giải thuật vững chãi. Giúp tối thiểu sai sót trong quy trình Scrum và tối ưu thời gian phát hành thử nghiệm.`;
    } else if (depts.includes('Tiếp thị & Truyền thông') && depts.includes('Thiết kế')) {
      baseScore += 22;
      synergyType = 'Phủ sóng Nhận diện Ấn tượng';
      synergyDesc = `Ngôn từ sắc bén kích thích tò mò kết hợp với ấn phẩm hình ảnh lôi cuốn có cấu trúc bố cục thu hút thị giác. Tạo ra vũ khí tiếp thị mạnh mẽ tăng vọt tỷ lệ nhấp chuột (CTR) và tạo dấu ấn ghi nhớ thương hiệu sâu sắc trong lòng khách hàng.`;
    } else if (depts.includes('Kinh doanh') && depts.includes('Tiếp thị & Truyền thông')) {
      baseScore += 15;
      synergyType = 'Chiến binh Tăng trưởng Doanh thu';
      synergyDesc = `Liên minh tác chiến hoàn mỹ từ thu hút phễu khách hàng tiềm năng ban đầu tới bước chốt giao dịch cam kết doanh nghiệp. Đảm bảo luồng thông tin phản hồi từ khách hàng được cập nhật liên tục làm chất liệu tinh chỉnh chiến dịch Content Marketing cốt lõi.`;
    } else if (
      memberA.department === 'Công nghệ thông tin' &&
      memberB.department === 'Công nghệ thông tin' &&
      memberA.id !== memberB.id
    ) {
      baseScore += 15;
      synergyType = 'Liên minh Full-stack Tối tân';
      synergyDesc = `Hai tinh hoa kỹ thuật cùng chí hướng. Phân chia vai trò Frontend và Backend chặt chẽ hoặc hỗ trợ quy trình Review Code chéo lẫn nhau. Đảm bảo tính toán tải lượng server thông minh và hiển thị giao diện mượt mà không độ trễ.`;
    } else {
      synergyDesc = `${memberA.fullName} và ${memberB.fullName} sở hữu nhiều kỹ năng đa dạng bổ trợ lẫn nhau vượt trội. Dễ dàng đồng kiến tạo thành công các dự án liên phòng ban phức tạp, tận dụng tối đa tài nguyên nền tảng của từng bộ phận.`;
    }

    // Limit maximum matching score to 99%
    const finalScore = Math.min(baseScore, 99);

    return {
      memberA,
      memberB,
      score: finalScore,
      overlapSkills,
      commonInterests,
      synergyType,
      synergyDesc,
    };
  }, [matchIdA, matchIdB, members]);

  // Handle Send Connection Request
  const handleSendRequest = (e: FormEvent) => {
    e.preventDefault();

    if (!reqSenderId || !reqReceiverId) {
      setCreateReport({ status: 'error', msg: 'Vui lòng chọn người gửi và người nhận.' });
      return;
    }

    if (reqSenderId === reqReceiverId) {
      setCreateReport({ status: 'error', msg: 'Người gửi và người nhận không thể trùng nhau.' });
      return;
    }

    // Check if duplicate connection exists or is pending
    const exists = connections.some(
      (c) =>
        (c.fromId === reqSenderId && c.toId === reqReceiverId) ||
        (c.fromId === reqReceiverId && c.toId === reqSenderId)
    );

    if (exists) {
      setCreateReport({
        status: 'error',
        msg: 'Yêu cầu kết nối hoặc trạng thái kết nối giữa cặp này đã tồn tại rồi.',
      });
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      fromId: reqSenderId,
      toId: reqReceiverId,
      status: 'pending',
      message: reqMessage.trim() || 'Rất vui được kết nối với bạn để trao đổi công việc!',
      timestamp: new Date().toISOString(),
    };

    setConnections([...connections, newConnection]);
    setReqMessage('');
    setCreateReport({
      status: 'success',
      msg: 'Gửi yêu cầu kết nối thành công! Đang chờ đối phương phản hồi.',
    });

    // Cleanup report after 3 seconds
    setTimeout(() => setCreateReport(null), 4000);
  };

  // Connection decision handler: Accept or Decline
  const handleProcessRequest = (id: string, decision: 'accept' | 'decline') => {
    setConnections(
      connections.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: decision === 'accept' ? 'connected' : 'declined',
          };
        }
        return c;
      })
    );
  };

  // Core Chatbot Simulated Responder Engine
  const executeSimulatedResponse = (connId: string, userText: string, receiver: Member, sender: Member) => {
    // Determine bot text based on context
    const lowerText = userText.toLowerCase();
    let reply = `Chào ${sender.fullName} nhé! Cảm ơn tin nhắn của bạn. Rất vui được hợp tác cùng bạn trong dự án này!`;

    if (lowerText.includes('chào') || lowerText.includes('hi') || lowerText.includes('hello')) {
      reply = `Chào ${sender.fullName}! Rất vui được trò chuyện với bạn. Bạn có ý tưởng hay đề xuất gì cần thảo luận không?`;
    } else if (lowerText.includes('rảnh') || lowerText.includes('thời gian') || lowerText.includes('họp')) {
      reply = `Mình có thể sắp xếp thời gian trống vào khoảng chiều mai hoặc sáng thứ Tư. Bạn thấy giờ nào phù hợp để chúng mình lên lịch online nhé?`;
    } else if (lowerText.includes('kỹ năng') || lowerText.includes('làm được') || lowerText.includes('chuyên môn')) {
      reply = `Chuyên môn chính của mình là ${receiver.role}. Các công cụ/kế hoạch mình thường triển khai gồm ${receiver.skills.slice(0, 3).join(', ')}. Chúng ta có thể tận dụng kiến thức này bổ trợ cho nhau!`;
    } else if (lowerText.includes('dự án') || lowerText.includes('làm chung') || lowerText.includes('hợp tác')) {
      reply = `Tuyệt vời! Ý tưởng hợp tác dự án nghe rất hứa hẹn. Để mình nghiên cứu kỹ thêm tài liệu rồi chúng ta lập một nhóm nhỏ để triển khai cụ thể nhé.`;
    } else {
      // Role personalized default replies
      if (receiver.role.includes('Frontend')) {
        reply = `Cảm ơn ${sender.fullName}. Là một Frontend Developer, mình rất mong muốn xây dựng giao diện tuyệt hảo cho dự án. Hãy chia sẻ thêm cho mình về thiết kế hoặc luồng hoạt động nhé!`;
      } else if (receiver.role.includes('Backend')) {
        reply = `Chào ${sender.fullName}! Về phần Backend và luồng cơ sở dữ liệu thì mình luôn sẵn sàng tải trọng lớn. Bạn cứ yên tâm gửi Spec hệ thống nha.`;
      } else if (receiver.role.includes('Marketing')) {
        reply = `Tuyệt quá! Chúng mình cần lên ngay một kế hoạch truyền thông, nghiên cứu đối tượng mục tiêu kĩ lưỡng để tối ưu tỉ lệ chuyển đổi tốt nhất có thể.`;
      } else if (receiver.role.includes('UI/UX')) {
        reply = `Hi ${sender.fullName}, mình sẽ thiết lập Figma Workspace và gửi sơ đồ khung xương sản phẩm (Wireframe) trước để bạn xem qua và phản hồi nhé!`;
      }
    }

    // Add Simulated Bot message after 1 second delay
    setTimeout(() => {
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        connectionId: connId,
        senderId: receiver.id,
        text: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMsgs) => [...prevMsgs, botMsg]);
    }, 1100);
  };

  // Chat message submit handler
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !activeChatDetails) return;

    const { conn, self, partner } = activeChatDetails;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      connectionId: conn.id,
      senderId: self.id,
      text: chatText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMsgs) => [...prevMsgs, userMsg]);
    setChatText('');

    // Trigger simulated reply from chatbot
    executeSimulatedResponse(conn.id, userMsg.text, partner, self);
  };

  // Pending connection count
  const pendingRequests = useMemo(() => {
    return connections.filter((c) => c.status === 'pending');
  }, [connections]);

  return (
    <div id="connection-section" className="space-y-8">
      {/* Visual Hub Banner */}
      <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-850 shadow-xl space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5.5 h-5.5 text-amber-400 animate-pulse" />
          <span>Mạng lưới Kết nối & Tình bằng hữu</span>
        </h2>
        <p className="text-neutral-400 text-sm">
          Nơi phát triển tinh thần đồng đội. Đánh giá độ tương hợp phối hợp dự án hoặc trực tiếp gửi thông điệp kết nối để trò chuyện trực tiếp qua chatbot thông minh.
        </p>
      </div>

      {/* Grid of 2 Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Matcher & Create Connection (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Module 1: Compatibility Synergy Matcher */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-850 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-805 bg-neutral-950/30 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                Đánh giá tương hợp đồng đội
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Selector A */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Thành viên 1</span>
                  <select
                    id="match-select-a"
                    value={matchIdA}
                    onChange={(e) => setMatchIdA(e.target.value)}
                    className="w-full text-xs font-semibold border rounded-xl py-2 px-2.5 bg-neutral-950 border-neutral-800 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id} className="bg-neutral-950 text-neutral-250">
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector B */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Thành viên 2</span>
                  <select
                    id="match-select-b"
                    value={matchIdB}
                    onChange={(e) => setMatchIdB(e.target.value)}
                    className="w-full text-xs font-semibold border rounded-xl py-2 px-2.5 bg-neutral-950 border-neutral-800 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id} disabled={m.id === matchIdA} className="bg-neutral-950 text-neutral-250">
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Match outcome block */}
              {compatibilityResult ? (
                <div className="pt-3 border-t border-neutral-805 space-y-4">
                  {/* Circular / Line compatibility percentage visual */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 flex items-center justify-center bg-amber-500/10 font-black text-amber-400 text-lg flex-shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                      {compatibilityResult.score}%
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight">
                        Chỉ số kết hợp ăn ý: {compatibilityResult.score >= 80 ? 'Tuyệt hảo' : 'Khá tốt'}
                      </h4>
                      <p className="text-[11px] font-bold text-amber-400 mt-0.5">
                        Hình thức: {compatibilityResult.synergyType}
                      </p>
                    </div>
                  </div>

                  {/* Paragraph text */}
                  <p className="text-neutral-305 text-xs leading-relaxed italic bg-neutral-950/50 border border-neutral-805 rounded-xl p-3">
                    &ldquo;{compatibilityResult.synergyDesc}&rdquo;
                  </p>

                  {/* Shared details lists */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Skills list overlap */}
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-805">
                      <span className="font-bold text-neutral-500 text-[10px] uppercase block mb-1">Kỹ năng tương đồng</span>
                      {compatibilityResult.overlapSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {compatibilityResult.overlapSkills.map((sk) => (
                            <span key={sk} className="bg-neutral-900 px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-300 border border-neutral-800">
                              {sk}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500 italic">Phong phú, hỗ trợ chéo nhau</span>
                      )}
                    </div>

                    {/* Common interests overlap */}
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-805">
                      <span className="font-bold text-neutral-500 text-[10px] uppercase block mb-1">Sở thích đồng điệu</span>
                      {compatibilityResult.commonInterests.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {compatibilityResult.commonInterests.map((int) => (
                            <span key={int} className="bg-neutral-900 px-1.5 py-0.5 rounded text-[10px] font-semibold text-pink-400 border border-pink-905">
                              {int}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500 italic">Có cơ hội khám phá điều mới</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border-t border-neutral-805">
                  <HelpCircle className="w-8 h-8 text-neutral-600 mx-auto opacity-75 mb-1.5" />
                  <p className="text-neutral-500 text-xs leading-5">
                    Chọn hai thành viên bất kỳ ở phía trên để hệ thống tự động phân tích độ ăn ý trong định hướng công việc và phong cách làm việc.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Module 2: Send Connection Invitation Form */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-850 p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-amber-400" />
              Gửi lời đề nghị Kết nối mới
            </h3>

            {createReport && (
              <div 
                className={`p-3 rounded-2xl border text-xs flex items-start gap-2 ${
                  createReport.status === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{createReport.msg}</span>
              </div>
            )}

            <form onSubmit={handleSendRequest} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {/* Sender choose */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Người gửi</label>
                  <select
                    id="select-sender"
                    value={reqSenderId}
                    onChange={(e) => setReqSenderId(e.target.value)}
                    className="w-full text-xs font-semibold border rounded-xl py-1.5 px-2 bg-neutral-950 border-neutral-800 text-neutral-200"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id} className="bg-neutral-950 text-neutral-200">
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Receiver choose */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Người nhận</label>
                  <select
                    id="select-receiver"
                    value={reqReceiverId}
                    onChange={(e) => setReqReceiverId(e.target.value)}
                    className="w-full text-xs font-semibold border rounded-xl py-1.5 px-2 bg-neutral-950 border-neutral-800 text-neutral-200"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id} disabled={m.id === reqSenderId} className="bg-neutral-950 text-neutral-200">
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message content */}
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Lời chào kết nối</label>
                <textarea
                  id="connection-proposal-message"
                  rows={2}
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  placeholder="Ví dụ: Rất ấn tượng với kỹ năng React của bạn, hãy cùng hợp tác bento nhé!"
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-550"
                />
              </div>

              <button
                id="btn-send-conn-request"
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-450 hover:to-orange-450 text-neutral-950 font-bold uppercase rounded-xl text-xs transition-all tracking-wider shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Gửi lời mời liên kết
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Manage Invitations & Chatbox Messenger (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Module 3: Connection Request Inbox (Pending) */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-850 shadow-xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 text-neutral-250">
                <Users className="w-4 h-4 text-amber-400" />
                Quản lý lời mời đang chờ ({pendingRequests.length})
              </span>
            </h3>

            {pendingRequests.length > 0 ? (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {pendingRequests.map((req) => {
                  const fromM = members.find((m) => m.id === req.fromId);
                  const toM = members.find((m) => m.id === req.toId);
                  if (!fromM || !toM) return null;

                  return (
                    <div 
                      key={req.id} 
                      className="p-3 border border-neutral-805 bg-neutral-950/40 rounded-2xl flex flex-col justify-between md:flex-row md:items-center gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="text-[11px] text-neutral-200 font-bold flex flex-wrap items-center gap-1">
                          <span className="text-amber-400">{fromM.fullName}</span>
                          <span className="font-medium text-neutral-510">gửi tới</span>
                          <span className="text-blue-400">{toM.fullName}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 italic line-clamp-2">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                        <button
                          id={`btn-accept-${req.id}`}
                          onClick={() => handleProcessRequest(req.id, 'accept')}
                          className="p-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Duyệt</span>
                        </button>
                        <button
                          id={`btn-decline-${req.id}`}
                          onClick={() => handleProcessRequest(req.id, 'decline')}
                          className="p-1 px-3 bg-neutral-900 hover:bg-rose-950 hover:text-rose-455 hover:border-rose-900 border border-neutral-800 text-neutral-400 rounded-lg text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-neutral-500 text-xs italic p-4 text-center border border-dashed border-neutral-800 bg-neutral-950/20 rounded-xl">
                Không có lời mời kết nối nào đang chờ phản hồi.
              </p>
            )}
          </div>

          {/* Module 4: Live Instant Chat Simulator */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-850 shadow-xl overflow-hidden flex flex-col h-[400px]">
            {/* Chat header area */}
            <div className="p-4 border-b border-neutral-805 bg-neutral-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-amber-400" />
                <span className="font-bold text-white text-sm">Hộp thư Chatbot Trực tuyến</span>
              </div>

              {/* Selector choosing the active connected channel */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-550">Kênh:</span>
                <select
                  id="active-chat-channel"
                  value={activeConnectionId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setActiveConnectionId(id);
                    const conn = connections.find((c) => c.id === id);
                    if (conn) setChatSenderId(conn.fromId);
                  }}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs py-1 px-2.5 rounded-lg font-semibold focus:outline-none"
                >
                  {connections
                    .filter((c) => c.status === 'connected')
                    .map((c) => {
                      const fromM = members.find((m) => m.id === c.fromId);
                      const toM = members.find((m) => m.id === c.toId);
                      return (
                        <option key={c.id} value={c.id} className="bg-neutral-950 text-neutral-200">
                          {fromM?.fullName.split(' ').pop()} ~ {toM?.fullName.split(' ').pop()}
                        </option>
                      );
                    })}
                  {connections.filter((c) => c.status === 'connected').length === 0 && (
                    <option value="" className="bg-neutral-950 text-neutral-450">Chưa có cặp kết nối nào</option>
                  )}
                </select>
              </div>
            </div>

            {/* If a chat is active */}
            {activeChatDetails ? (
              <div className="flex-1 flex flex-col min-h-0 bg-neutral-900/40">
                {/* Switch Sender indicator row */}
                <div className="px-4 py-1.5 bg-neutral-950/80 border-b border-neutral-850 text-[10px] text-neutral-450 flex items-center justify-between flex-shrink-0">
                  <span>
                    Đang xem dưới góc nhìn của:{' '}
                    <strong className="text-amber-400">{activeChatDetails.self.fullName}</strong>
                  </span>
                  
                  <button
                    id="btn-switch-identity"
                    onClick={() => {
                      const details = activeChatDetails;
                      if (details) {
                        setChatSenderId(
                          chatSenderId === details.conn.fromId 
                            ? details.conn.toId 
                            : details.conn.fromId
                        );
                      }
                    }}
                    className="font-bold text-neutral-300 hover:text-amber-400 underline cursor-pointer"
                  >
                    Đổi vai người gửi
                  </button>
                </div>

                {/* Bubble dialog content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {activeChatDetails.chatHistory.map((msg) => {
                    const isSelf = msg.senderId === chatSenderId;
                    const messageSender = members.find((m) => m.id === msg.senderId);

                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] space-y-1 ${isSelf ? 'text-right' : 'text-left'}`}>
                          
                          {/* Sender name above bubble */}
                          <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">
                            {messageSender?.fullName}
                          </span>

                          {/* Text bubble */}
                          <div 
                            className={`p-3 rounded-2xl text-xs leading-relaxed inline-block text-left ${
                              isSelf
                                ? 'bg-amber-600 text-neutral-950 rounded-tr-none font-medium shadow-[0_2px_8px_rgba(217,119,6,0.15)]'
                                : 'bg-neutral-950 border border-neutral-805 text-neutral-200 rounded-tl-none shadow-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                {/* Dynamic mini chat typist footer */}
                <form onSubmit={handleSendChatMessage} className="p-3 border-t border-neutral-850 bg-neutral-950 flex items-center gap-2 flex-shrink-0">
                  <input
                    id="chat-input-box"
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder={`Gửi tin nhắn với tư cách ${activeChatDetails.self.fullName.split(' ').pop()}...`}
                    className="flex-1 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    id="btn-chat-send"
                    type="submit"
                    className="p-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl shadow-md transition-transform hover:scale-105 flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4 fill-current text-neutral-950" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-500 bg-neutral-900/20">
                <MessageSquare className="w-12 h-12 text-neutral-700 mb-2 animate-bounce" />
                <h4 className="font-bold text-white text-sm">Chưa có cuộc trò chuyện nào</h4>
                <p className="text-xs text-neutral-450 mt-1.5 max-w-xs leading-5">
                  Vui lòng chờ phê duyệt các thư kết nối hoặc tự tạo một lời mời kết nối thành công để bắt đầu bàn thảo qua chatbot phản hồi tức thì.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
