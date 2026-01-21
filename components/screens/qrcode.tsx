import React, { useState, useEffect } from 'react';

interface ScannerAppProps {
  onClose: () => void;
}

const ScannerApp: React.FC<ScannerAppProps> = ({ onClose }) => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanMode, setScanMode] = useState('barcode'); // 'barcode' | 'food'
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // 注入自定义动画样式
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes scan-move {
        0%, 100% { top: 10%; opacity: 0.8; }
        50% { top: 90%; opacity: 1; }
      }
      .animate-scan {
        animation: scan-move 2.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="bg-black font-['Manrope'] text-white overflow-hidden min-h-screen flex justify-center items-center z-[100] fixed inset-0">
     
      {/* 移动端容器 */}
      <div className="relative w-full max-w-md h-full bg-black flex flex-col shadow-2xl overflow-hidden">
       
        {/* 背景：模拟相机预览流 */}
        <div className="absolute inset-0 z-0">
          <div
            className={`w-full h-full bg-cover bg-center transition-opacity duration-300 ${isFlashOn ? 'brightness-125' : 'opacity-80'}`}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
            }}
          ></div>
          {/* 暗色遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>

        {/* 顶部控制栏 */}
        <div className="relative z-20 flex justify-between items-start px-6 pt-12">
          <button
            onClick={() => setIsFlashOn(!isFlashOn)}
            className={`size-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-all ${isFlashOn ? 'bg-white text-black' : 'bg-white/20 text-white'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isFlashOn ? 'flash_off' : 'flash_on'}
            </span>
          </button>
         
          <button
            onClick={onClose}
            className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-white/30"
          >
            <span className="material-symbols-outlined text-white text-[20px]">close</span>
          </button>
        </div>

        {/* 中间扫描区域 */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
         
          {/* 扫描框 */}
          <div className="relative w-72 h-72">
            {/* 四角边框 */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl shadow-sm"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl shadow-sm"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl shadow-sm"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl shadow-sm"></div>
           
            {/* 聚焦遮罩技巧：利用巨大的边框来创建聚焦区域外的暗色背景 */}
            <div className="absolute -inset-[100vh] border-[100vh] border-black/50 pointer-events-none rounded-[3rem]"></div>

            {/* 扫描激光线 (带动画) */}
            {isScanning && (
              <div className="absolute left-4 right-4 h-[2px] bg-red-500 shadow-[0_0_12px_3px_rgba(239,68,68,0.6)] animate-scan rounded-full z-30"></div>
            )}
           
            {/* 辅助网格点 (仅在 Identify Food 模式显示) */}
            {scanMode === 'food' && (
               <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-4 opacity-30 z-20 pointer-events-none">
                 {[...Array(9)].map((_, i) => (
                   <div key={i} className="flex justify-center items-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                   </div>
                 ))}
               </div>
            )}
          </div>

          {/* 提示文本 */}
          <div className="mt-8 px-5 py-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-xs font-medium tracking-wide shadow-xl z-30 animate-pulse">
            {scanMode === 'barcode'
              ? 'Align barcode within the frame'
              : 'Point at food to identify'}
          </div>
        </div>

        {/* 底部模式切换 */}
        <div className="relative z-20 w-full pb-32">
          <div className="flex justify-center items-center gap-12">
           
            {/* Scan Barcode 按钮 */}
            <button
              onClick={() => setScanMode('barcode')}
              className="flex flex-col items-center gap-2 group transition-all duration-300"
            >
              <span className={`font-bold text-sm tracking-wide shadow-black drop-shadow-md transition-colors ${scanMode === 'barcode' ? 'text-white' : 'text-white/50'}`}>
                Scan Barcode
              </span>
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${scanMode === 'barcode' ? 'bg-[#4d7f80] shadow-[0_0_8px_rgba(77,127,128,1)] scale-100' : 'bg-transparent scale-0'}`}></span>
            </button>

            {/* Identify Food 按钮 */}
            <button
              onClick={() => setScanMode('food')}
              className="flex flex-col items-center gap-2 group transition-all duration-300"
            >
              <span className={`font-bold text-sm tracking-wide shadow-black drop-shadow-md transition-colors ${scanMode === 'food' ? 'text-white' : 'text-white/50'}`}>
                Identify Food
              </span>
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${scanMode === 'food' ? 'bg-[#4d7f80] shadow-[0_0_8px_rgba(77,127,128,1)] scale-100' : 'bg-transparent scale-0'}`}></span>
            </button>
           
          </div>
        </div>

        {/* 底部导航栏 (模仿背景模糊效果) */}
        <nav className="absolute bottom-0 left-0 w-full bg-[#edf7f4]/90 dark:bg-[#1f2e29]/90 backdrop-blur-lg border-t border-black/5 flex justify-between items-end px-8 pt-3 pb-8 z-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <NavButton icon="restaurant_menu" label="Plan" />
            <NavButton icon="edit_note" label="Diary" />
           
            {/* 浮动扫描按钮 (当前激活状态) */}
            <div className="-mt-12 flex items-center justify-center">
              <button className="size-14 bg-[#4d7f80] text-white rounded-full shadow-lg shadow-[#4d7f80]/40 flex items-center justify-center border-4 border-[#edf7f4] dark:border-[#1f2e29]">
                <span className="material-symbols-outlined text-3xl">barcode_scanner</span>
              </button>
            </div>

            <NavButton icon="menu_book" label="Recipes" filled />
            <NavButton icon="person" label="Profile" />
        </nav>
      </div>
    </div>
  );
};

// --- 子组件：导航按钮 ---
const NavButton = ({ icon, label, filled }: any) => (
  <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#4d7f80] transition-colors cursor-default">
    <span
      className="material-symbols-outlined text-2xl"
      style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
    >
      {icon}
    </span>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default ScannerApp;