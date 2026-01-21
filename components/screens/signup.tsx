import React, { useState } from 'react';
import { registerUser } from '../../services/userService';
import { setCurrentUserId } from '../../lib/supabase';

// 注意：请确保您的 index.html 或环境中已引入 Material Symbols 和 Manrope 字体
// <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined..." rel="stylesheet" />

interface SignUpProps {
  onLogin: () => void;
  onSignUpSuccess?: () => void;
}

const NutriGuideSignUp: React.FC<SignUpProps> = ({ onLogin, onSignUpSuccess }) => {
  // --- 状态管理 ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // --- 事件处理 ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 简单的密码匹配验证
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { user, error: regError } = await registerUser(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (regError) {
        setError(regError);
        setLoading(false);
        return;
      }

      if (user) {
        // 保存用户ID到localStorage
        setCurrentUserId(user.id);
        // 注册成功，跳转到设置页面或仪表板
        if (onSignUpSuccess) {
          onSignUpSuccess();
        } else {
          onLogin();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log("Back button clicked - Navigate back");
    onLogin();
  };

  // --- 样式配置 (用于复杂的遮罩和背景) ---
  const bgImageStyle = {
    // 替换为与绿色健康主题匹配的图片
    backgroundImage: "url('https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=2070&auto=format&fit=crop')",
    maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#f6f7f7] dark:bg-[#161b1c] font-sans antialiased text-gray-900 dark:text-gray-100">

      {/* 顶部背景区域 (高度设为 40% 以匹配设计) */}
      <div className="absolute inset-x-0 top-0 h-[40%] z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-500"
          style={bgImageStyle}
          aria-label="Top view of a healthy green smoothie bowl"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4c7d7e]/10 via-transparent to-[#f6f7f7] dark:to-[#161b1c]"></div>
      </div>

      {/* 返回按钮 */}
      <div className="absolute top-0 left-0 z-20 w-full p-6 safe-area-inset-top">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 dark:bg-black/50 text-gray-700 dark:text-white"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      {/* 主卡片内容区 */}
      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="w-full rounded-t-[2.5rem] bg-white px-8 pb-10 pt-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:bg-gray-900 safe-area-inset-bottom">

          {/* 标题 */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Sign up to start your healthy journey</p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">

            {/* 姓名输入 */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#4c7d7e]">person</span>
              </div>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c7d7e] dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 outline-none transition-shadow"
                placeholder="Full Name"
              />
            </div>

            {/* 邮箱输入 */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#4c7d7e]">mail</span>
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c7d7e] dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 outline-none transition-shadow"
                placeholder="Email address"
              />
            </div>

            {/* 密码输入 */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#4c7d7e]">lock</span>
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c7d7e] dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 outline-none transition-shadow"
                placeholder="Password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* 确认密码输入 */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#4c7d7e]">lock</span>
              </div>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c7d7e] dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 outline-none transition-shadow"
                placeholder="Confirm Password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#4c7d7e] py-4 text-lg font-bold text-white shadow-lg shadow-[#4c7d7e]/25 transition-all hover:bg-[#4c7d7e]/90 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* 分割线 */}
          <div className="relative my-6">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500 dark:bg-gray-900">Or continue with</span>
            </div>
          </div>

          {/* 社交登录按钮 */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
              <img alt="Google" className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
              <img alt="Apple" className="h-5 w-5 dark:invert" src="https://www.svgrepo.com/show/508854/apple-black.svg" />
              Apple
            </button>
          </div>

          {/* 底部跳转登录 */}
          <div className="mt-6 text-center pb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button onClick={onLogin} className="font-bold text-[#4c7d7e] transition-colors hover:text-[#4c7d7e]/80 hover:underline decoration-[#F9C0B3] underline-offset-4 decoration-2">
                Log In
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NutriGuideSignUp;