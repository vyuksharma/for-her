import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Image as ImageIcon, MessageSquareHeart, Check } from 'lucide-react';

export type ChatTaskMode = 'interactive' | 'reasoning' | 'general' | 'fast';
export type ImageResolutionSize = '1K' | '2K' | '4K';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
}

interface KeepsakeStudioDrawerProps {
  isOpen: boolean;
  initialTab: 'chat' | 'image';
  onClose: () => void;
  onPinToPolaroid: (imageUrl: string) => void;
}

function createIllustratedFallbackDataUrl(promptText: string, size: ImageResolutionSize): string {
  const safePrompt = promptText.replace(/[<>&"']/g, '').slice(0, 48);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <rect width="600" height="600" fill="#FFF7EB"/>
    <rect x="28" y="28" width="544" height="544" rx="28" fill="#F8E9E8" stroke="#C98D9D" stroke-width="3" stroke-dasharray="10 8"/>
    <circle cx="300" cy="250" r="115" fill="#FFFDF9" stroke="#8C7771" stroke-width="3"/>
    <circle cx="255" cy="185" r="24" fill="#4A3B3D"/>
    <circle cx="345" cy="185" r="24" fill="#4A3B3D"/>
    <ellipse cx="300" cy="240" rx="68" ry="58" fill="#FFFDF9" stroke="#59484A" stroke-width="4"/>
    <ellipse cx="274" cy="235" rx="16" ry="20" transform="rotate(-12 274 235)" fill="#4A3B3D"/>
    <ellipse cx="326" cy="235" rx="16" ry="20" transform="rotate(12 326 235)" fill="#4A3B3D"/>
    <circle cx="276" cy="231" r="5" fill="#FFFDF9"/>
    <circle cx="324" cy="231" r="5" fill="#FFFDF9"/>
    <ellipse cx="254" cy="252" rx="11" ry="6" fill="#E8A5B2"/>
    <ellipse cx="346" cy="252" rx="11" ry="6" fill="#E8A5B2"/>
    <ellipse cx="300" cy="246" rx="8" ry="5" fill="#4A3B3D"/>
    <rect x="245" y="285" width="110" height="44" rx="8" fill="#B84A4A" stroke="#59484A" stroke-width="3"/>
    <rect x="258" y="293" width="64" height="28" rx="4" fill="#FFF7EB"/>
    <text x="300" y="435" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#59484A" font-style="italic">"${safePrompt}"</text>
    <text x="300" y="475" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#8C7771">Scrapbook Keepsake · ${size} Canvas</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const KeepsakeStudioDrawer: React.FC<KeepsakeStudioDrawerProps> = ({
  isOpen,
  initialTab,
  onClose,
  onPinToPolaroid,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>(initialTab);

  // Chat state
  const [taskMode, setTaskMode] = useState<ChatTaskMode>('interactive');
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: "Hi! I'm your Scrapbook Keepsake Companion. I can help you reflect on the chapters in 'The Month Between Us', draft a sweet reply note, or plan Page 03 and the final surprise.",
      modelUsed: 'gemini-4-argon',
    },
  ]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Image Generation state
  const [imagePrompt, setImagePrompt] = useState(
    'A cute watercolor panda holding a KitKat bar and a miniature chocolate bouquet on warm cream paper'
  );
  const [imageSize, setImageSize] = useState<ImageResolutionSize>('1K');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageStatusMsg, setImageStatusMsg] = useState<string | null>(null);
  const [pinnedSuccess, setPinnedSuccess] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          taskMode,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Chat API unavailable');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply,
          modelUsed: data.model,
        },
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '';
      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: `Here is a gentle thought for your scrapbook: "${trimmed}" captures the warmth of meeting again after a month apart—from the playful ₹500 Capy chocolate box confession on Page 01 to the quiet, honest apology on Page 02. (Note: Connect a Gemini API key in Settings > Secrets for live ${taskMode} model responses${errMsg ? ` — ${errMsg}` : ''}.)`,
          modelUsed:
            taskMode === 'reasoning'
              ? 'gemini-4-carbon'
              : taskMode === 'general'
                ? 'gemini-4-hydrogen'
                : taskMode === 'fast'
                  ? 'gemini-3.1-flash-lite'
                  : 'gemini-4-argon',
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = imagePrompt.trim();
    if (!trimmed || isGeneratingImage) return;

    setIsGeneratingImage(true);
    setImageStatusMsg(null);
    setPinnedSuccess(false);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          imageSize,
          aspectRatio: '1:1',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || 'Image generation requires a paid Gemini API key');
      }

      setGeneratedImage(data.imageUrl);
      setImageStatusMsg(`Generated at ${imageSize} resolution with gemini-3-pro-image-preview`);
    } catch {
      const fallbackUrl = createIllustratedFallbackDataUrl(trimmed, imageSize);
      setGeneratedImage(fallbackUrl);
      setImageStatusMsg(
        `Created ${imageSize} illustrated scrapbook keepsake (attach a paid Gemini key in Settings > Secrets for live gemini-3-pro-image-preview rendering).`
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePinImage = () => {
    if (!generatedImage) return;
    onPinToPolaroid(generatedImage);
    setPinnedSuccess(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keepsake-studio-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#59484A]/45 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full max-w-xl bg-[#FFF7EB] border border-[#C98D9D]/45 rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#F8E9E8] border-b border-[#C98D9D]/30 flex items-center justify-between">
          <div>
            <h2
              id="keepsake-studio-title"
              className="font-handwritten text-2xl sm:text-3xl font-bold text-[#59484A]"
            >
              Scrapbook Keepsake Studio
            </h2>
            <p className="font-ui text-xs text-[#8C7771]">
              Companion chat &amp; Polaroid illustration generator
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Keepsake Studio"
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-[#C98D9D]/20 flex items-center justify-center text-[#59484A] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-[#8C7771]/15 grid grid-cols-2 gap-2 bg-[#FFFDF9]">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg font-ui text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'chat'
                ? 'bg-[#C98D9D] text-[#FFFDF9]'
                : 'bg-[#FFF7EB] text-[#59484A] hover:bg-[#F8E9E8]'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5 shrink-0" />
            <span>Companion Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg font-ui text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'image'
                ? 'bg-[#C98D9D] text-[#FFFDF9]'
                : 'bg-[#FFF7EB] text-[#59484A] hover:bg-[#F8E9E8]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Polaroid (1K/2K/4K)</span>
          </button>
        </div>

        {/* Body Content */}
        {activeTab === 'chat' ? (
          <div className="flex flex-col flex-1 min-h-0 p-5 space-y-4">
            {/* Model / Role Mode Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="chat-mode-select" className="font-ui text-xs text-[#8C7771]">
                Companion Thinking Mode:
              </label>
              <select
                id="chat-mode-select"
                value={taskMode}
                onChange={(e) => setTaskMode(e.target.value as ChatTaskMode)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#8C7771]/35 font-ui text-xs text-[#59484A]"
              >
                <option value="interactive">Interactive Role (gemini-4-argon)</option>
                <option value="reasoning">Deep Reflection (gemini-4-carbon)</option>
                <option value="general">General Note Helper (gemini-4-hydrogen)</option>
                <option value="fast">Fast Response (gemini-3.1-flash-lite)</option>
              </select>
            </div>

            {/* Scrollable Multi-Turn Thread */}
            <div
              ref={chatScrollRef}
              data-testid="chat-thread"
              className="flex-1 min-h-[220px] max-h-[320px] overflow-y-auto rounded-xl bg-[#FFFDF9] border border-[#8C7771]/20 p-4 space-y-3"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#C98D9D] text-[#FFFDF9]'
                        : 'bg-[#F8E9E8]/80 text-[#59484A] border border-[#C98D9D]/30'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  {msg.modelUsed && (
                    <span className="font-ui text-[10px] text-[#8C7771] mt-1 px-1">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>
              ))}
              {isSendingChat && (
                <p className="font-ui text-xs text-[#8C7771] italic">
                  Writing a thoughtful response...
                </p>
              )}
            </div>

            {/* Chat Form */}
            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              <label htmlFor="scrapbook-chat-input" className="sr-only">
                Ask the Scrapbook Companion
              </label>
              <input
                id="scrapbook-chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about the scrapbook or draft a sweet note..."
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#8C7771]/35 font-ui text-sm text-[#59484A] placeholder:text-[#8C7771]/70 focus:outline-2 focus:outline-[#C98D9D]"
              />
              <button
                type="submit"
                disabled={isSendingChat || !chatInput.trim()}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C98D9D] hover:bg-[#b87b8b] disabled:opacity-50 text-[#FFFDF9] font-ui text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 p-5 space-y-4 overflow-y-auto">
            <form onSubmit={handleGenerateImage} className="space-y-4">
              <div>
                <label
                  htmlFor="polaroid-prompt-input"
                  className="block font-ui text-xs font-medium text-[#59484A] mb-1.5"
                >
                  Scrapbook Illustration Prompt (gemini-3-pro-image-preview)
                </label>
                <textarea
                  id="polaroid-prompt-input"
                  rows={2}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FFFDF9] border border-[#8C7771]/35 font-ui text-sm text-[#59484A] focus:outline-2 focus:outline-[#C98D9D]"
                />
              </div>

              {/* Image Size Selector (1K, 2K, 4K) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-ui text-xs font-medium text-[#59484A]">
                  Resolution Size:
                </span>
                <div className="flex items-center gap-1.5 bg-[#FFFDF9] p-1 rounded-xl border border-[#8C7771]/25">
                  {(['1K', '2K', '4K'] as ImageResolutionSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`min-h-[36px] px-3.5 py-1 rounded-lg font-ui text-xs font-semibold transition-colors cursor-pointer ${
                        imageSize === size
                          ? 'bg-[#C98D9D] text-[#FFFDF9]'
                          : 'text-[#59484A] hover:bg-[#F8E9E8]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C98D9D] hover:bg-[#b87b8b] disabled:opacity-50 text-[#FFFDF9] font-ui text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isGeneratingImage
                    ? `Illustrating (${imageSize})...`
                    : `Generate ${imageSize} Polaroid Illustration`}
                </span>
              </button>
            </form>

            {imageStatusMsg && (
              <p className="font-ui text-xs text-[#8C7771]">{imageStatusMsg}</p>
            )}

            {generatedImage && (
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#C98D9D]/35 flex flex-col items-center gap-3">
                <img
                  src={generatedImage}
                  alt="Generated scrapbook keepsake illustration"
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 object-cover rounded-lg border border-[#8C7771]/20"
                />
                <button
                  type="button"
                  onClick={handlePinImage}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-[#B9C9B0]/60 hover:bg-[#B9C9B0] text-[#59484A] font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {pinnedSuccess
                      ? 'Pinned to Page 01 Polaroid Frame!'
                      : 'Pin to Page 01 Polaroid Frame'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
