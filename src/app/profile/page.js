"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ShapeGrid from "@/components/FloatingLines";
import { useState, useEffect } from "react";
import RefreshButton from "@/components/RefreshButton";
import ThemeToggle from "@/app/ThemeToggle";
import { OPTIONS_MAP } from "@/lib/question";
import UserPreferences from "@/components/UserPreferences";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state for editing
  const [editData, setEditData] = useState({
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    image: session?.user?.image ?? ""
  });

  // Move useEffect to the top, before any early returns
  useEffect(() => {
    if (session) {
      setEditData({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? ""
      });
    }
  }, [session]);

  if (status === "loading") return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-t-orange-500 border-orange-500/20 rounded-full animate-spin" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center gap-4">
      <span className="text-4xl">🔒</span>
      <Link href="/login" className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm">Login</Link>
    </div>
  );

  const q = session.user.questionnaire ?? [];
  const diet = q.find(x => x.questionId === "dietType")?.answer?.[0];
  const goals = q.find(x => x.questionId === "healthGoals" || x.questionId === "weightGoal")?.answer ?? [];

  const validateForm = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = "Name is required";
    else if (editData.name.length < 2) newErrors.name = "Name is too short";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(editData.email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 128;
          const MAX_HEIGHT = 128;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setEditData({ ...editData, image: canvas.toDataURL('image/jpeg', 0.7) });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (res.ok) {
        await update({ user: data.user }); // Update the session with new data
        console.log("Profile updated successfully!");
      } else {
        console.error("Failed to update profile:", data.message);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen relative bg-[var(--bg-color)] transition-colors duration-500 overflow-x-hidden">
      <style>{`
        @keyframes whiteCardPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.15); }
          50% { box-shadow: 0 0 60px 10px rgba(255, 255, 255, 0.3); }
        }
        .food-engine-card {
          background: transparent;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 1.5rem; /* Squared shape */
          box-shadow: var(--card-shadow), 0 0 20px -5px var(--gradient-start), 0 0 20px -5px var(--gradient-end);
          border: 1.5px solid var(--card-border);
          backdrop-filter: blur(40px) saturate(210%);
          z-index: 0;
        }

        .food-engine-card::before {
          content: '';
          position: absolute;
          width: 200px;
          background-image: linear-gradient(180deg, var(--gradient-start), var(--gradient-end));
          height: 200%;
          top: -50%;
          left: 35%;
          animation: rotBGimg 8s linear infinite;
          transition: all 0.2s linear;
          z-index: -2;
        }

        .food-engine-card::after {
          content: '';
          position: absolute;
          background: var(--bg-color);
          inset: 3px;
          border-radius: 1.3rem;
          z-index: -1;
          backdrop-filter: blur(40px);
          transition: all 0.4s ease;
        }

        @keyframes rotBGimg {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
          75% { transform: rotate(-12deg); }
        }
        .edit-icon-wiggle {
          animation: wiggle 0.6s ease-in-out 2;
          animation-delay: 0.8s;
        }

        .header-engine-card {
          background: var(--card-bg);
          position: relative;
          overflow: hidden;
          z-index: 0;
        }
        .header-engine-card::before {
          content: '';
          position: absolute;
          width: 250px;
          background-image: linear-gradient(180deg, #10b981, #3b82f6);
          height: 400%;
          top: -100%;
          left: 45%;
          animation: rotBGimg 12s linear infinite;
          z-index: -2;
          opacity: 0.6;
        }
        .header-engine-card::after {
          content: '';
          position: absolute;
          background: var(--card-inner-bg);
          inset: 2px;
          border-radius: 1rem;
          z-index: -1;
          backdrop-filter: blur(40px);
        }

        // .nav-side-item {
        //   background: var(--card-bg);
        //   border: 1px solid var(--glass-border);
        //   backdrop-filter: blur(20px);
        //   box-shadow: var(--card-shadow);
        //   transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        // }
      `}</style>

      {/* Original background — ShapeGrid only */}
      <div className="absolute inset-0 z-[1]">
        <ShapeGrid speed={0.2} squareSize={40} direction="diagonal"
          borderColor="rgba(0,242,255,0.15)" hoverFillColor="rgba(0,242,255,0.3)"
          shape="square" hoverTrailAmount={2} />
      </div>

      {/* Topbar */}
      <header className="fixed top-2 inset-x-4 z-30">
        <div className=" rounded-2xl ">
          <div className="relative z-10 flex items-center justify-between px-5 py-2.5">
            {/* Left: Logo side */}
            <div className="flex items-center flex-1">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-sm">🍽️</span>
                </div>
                <span className="font-black text-[var(--text-main)] hidden sm:block">Meal<span className="text-green-400">Mind</span></span>
              </Link>
            </div>

            {/* Center: Title / Context */}
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] whitespace-nowrap">User Profile</span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center justify-end gap-3 flex-1">
              <RefreshButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ── Side Navigation (Left side, below header) ── */}
      <div className="fixed top-24 left-6 z-30">
        <Link href="/" className="flex flex-col items-center gap-2 group">
          <div className=" flex items-center justify-between ">
            <span className="text-xl transition-transform group-hover:-translate-x-1">⬅️</span>
             <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)] group-hover:text-orange-500 transition-colors">Back</span>
    
          </div>
             </Link>
      </div>

      {/* Content */}
      <main className="relative z-10 min-h-screen flex items-end justify-center pt-16 pb-10 px-4">
        <div className="w-full max-w-md">

          <div className="food-engine-card p-6 flex flex-col gap-6"
            style={{ '--gradient-start': 'rgb(0, 183, 255)', '--gradient-end': 'rgb(255, 48, 255)' }}>
            
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-orange-400 hover:border-orange-500/30 hover:bg-white/10 transition-all shadow-lg edit-icon-wiggle"
              title="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>

            {/* ── Section 1: Identity ── */}
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-3xl border-2 border-white/20 shadow-xl bg-white/5 flex items-center justify-center text-4xl font-black text-orange-400 overflow-hidden">
                {session.user.image
                  ? <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  : session.user.name?.charAt(0) ?? "U"}
              </div>
              <div className="text-center">
                <p className="text-[var(--text-main)] font-black text-xl tracking-tight">{session.user.name ?? "Chef"}</p>
                <p className="text-[var(--text-muted)] text-xs font-medium mt-1">{session.user.email}</p>
              </div>
            </div>

            {/* ── Section 2: Stats ── */}
            <div className="w-full grid grid-cols-2 gap-2 relative z-10">
              <div className="bg-white/5 border border-[var(--glass-border)] rounded-2xl p-3 flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-orange-500 rounded-full" />
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Goals</p>
                </div>
                {goals.length > 0 ? (
                  <p className="font-black text-orange-400 text-xs capitalize truncate leading-none">{goals[0]}</p>
                ) : (
                  <p className="font-black text-[var(--text-muted)] text-xs leading-none">—</p>
                )}
              </div>
              <div className="bg-white/5 border border-[var(--glass-border)] rounded-2xl p-3 flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-orange-500 rounded-full" />
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Diet</p>
                </div>
                <p className="font-black text-orange-400 text-xs capitalize truncate leading-none">{diet ?? "—"}</p>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 relative z-10" />

            {/* ── Section 3: Preferences (Dropdown) ── */}
            <UserPreferences 
              questionnaire={q} 
              userId={session?.user?.id} 
              updateSession={update} 
            />

            <div className="w-full h-px bg-white/10 relative z-10" />


            {/* ── Section 5: Actions ── */}
            <div className="flex flex-row gap-2 relative z-10">
              <Link href="/preferences" className="flex-1 flex items-center justify-center px-4 py-3 bg-white/5 border border-[var(--glass-border)] rounded-2xl hover:bg-white/10 hover:border-orange-500/30 transition-all group">
                <span className="text-[11px] font-bold text-[var(--text-main)] group-hover:text-orange-400 transition-colors uppercase tracking-wider">⚙️ Settings</span>
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-1 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[11px] font-bold hover:bg-red-500/20 transition-all uppercase tracking-wider">
                🚪 Logout
              </button>
            </div>
            
            <p className="text-center text-[var(--text-muted)] text-[10px] relative z-10">Personalizing your recommendations</p>
          </div>
        </div>
      </main>

      {/* ── Edit Profile Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="food-engine-card w-full max-w-sm p-8 flex flex-col gap-6"
               style={{ '--gradient-start': 'rgb(251, 146, 60)', '--gradient-end': 'rgb(234, 88, 12)' }}>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[var(--text-main)] font-black text-xl tracking-tight">Update Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">✕</button>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-orange-400 font-bold uppercase tracking-widest px-1">Display Name</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className={`bg-white/5 border ${errors.name ? 'border-red-500' : 'border-[var(--glass-border)]'} rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder:opacity-30`}
                    placeholder="Your Name"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] px-1">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-orange-400 font-bold uppercase tracking-widest px-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editData.email}
                    disabled
                    className="bg-white/5 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[var(--text-muted)] text-sm cursor-not-allowed opacity-50"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-orange-400 font-bold uppercase tracking-widest px-1">Profile Image</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-[var(--glass-border)]">
                      {editData.image ? (
                        <img src={editData.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-lg">📷</div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      id="profile-upload"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="profile-upload" className="cursor-pointer text-[11px] font-bold text-[var(--text-main)] bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all active:scale-95">
                      Upload from Device
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 bg-white/5 border border-[var(--glass-border)] rounded-2xl text-[var(--text-muted)] text-xs font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 rounded-2xl text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all"
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}