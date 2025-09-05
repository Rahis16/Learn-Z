"use client";
import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Rocket,
  Stars,
  CloudLightning,
  Target,
  Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Dynamic Mouse Cursor Effect */}
      {/* <div
        className="fixed pointer-events-none z-50 w-6 h-6 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-sm opacity-40 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      /> */}

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50" />

        {/* Animated Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200/30 to-sky-300/30 rounded-full blur-3xl animate-pulse"
          style={{
            animation:
              "float1 8s ease-in-out infinite, pulse 3s ease-in-out infinite",
          }}
        />

        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-violet-200/40 to-fuchsia-300/40 rounded-full blur-3xl"
          style={{
            animation:
              "float2 10s ease-in-out infinite, pulse 4s ease-in-out infinite",
          }}
        />

        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-200/35 to-indigo-300/35 rounded-full blur-3xl"
          style={{
            animation:
              "rotate 12s linear infinite, pulse 5s ease-in-out infinite",
          }}
        />

        <div
          className="absolute top-60 right-1/3 w-64 h-64 bg-gradient-to-r from-fuchsia-200/30 to-violet-300/30 rounded-full blur-2xl"
          style={{
            animation:
              "float1 6s ease-in-out infinite reverse, pulse 3.5s ease-in-out infinite",
          }}
        />
      </div>

      <div className="min-h-screen text-zinc-900 relative z-10">
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce"
                style={{ animationDelay: "0s", animationDuration: "6s" }}
              >
                <Rocket size={60} className="inline-block" />
              </div>
              <div
                className="absolute top-50 right-20 text-4xl opacity-30 animate-bounce"
                style={{ animationDelay: "2s", animationDuration: "8s" }}
              >
                <CloudLightning size={60} className="inline-block" />
              </div>
              <div
                className="absolute bottom-40 left-20 text-5xl opacity-25 animate-bounce"
                style={{ animationDelay: "4s", animationDuration: "7s" }}
              >
                <Target size={60} className="inline-block" />
              </div>
              <div
                className="absolute top-20 right-32 text-3xl opacity-20 animate-bounce"
                style={{ animationDelay: "1s", animationDuration: "9s" }}
              >
                <Bot size={60} className="inline-block" />
              </div>
            </div>

            {/* Main Hero Card */}
            <div
              className={`relative transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200/50 via-violet-200/50 to-sky-200/50 rounded-3xl blur-xl animate-pulse" />

              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-12 overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent leading-tight animate-gradient mb-6">
                    Learn-z
                  </h1>

                  <div className="max-w-4xl mx-auto mb-8">
                    <h2 className="text-2xl sm:text-4xl font-bold text-zinc-800 mb-6">
                      Where Education Meets{" "}
                      <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-transparent animate-pulse">
                        Revolution
                      </span>
                    </h2>
                    <p className="text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
                      We're not just another learning platform. We're the future
                      of education, designed by Gen-Z, for Gen-Z. Experience
                      learning that's as addictive as your favorite social
                      media.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    <a
                      onClick={() => router.push("/dashboard")}
                      className="group px-8 py-4 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 rounded-2xl font-semibold text-lg text-white shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden transform hover:scale-105 hover:-translate-y-1 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 via-violet-400 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        Start Learning <Lightbulb className="inline-block" />
                      </span>
                    </a>

                    <a
                      href=""
                      className="px-8 py-4 bg-white/40 backdrop-blur-xl rounded-2xl font-semibold text-lg border border-white/30 text-zinc-700 hover:bg-white/60 hover:text-zinc-900 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 transform hover:scale-105 hover:-translate-y-1 active:scale-95"
                    >
                      Explore Features <Stars className="inline-block" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div
            className="text-center mb-16 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-4">
              Why We're Different
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              We don't do boring. Every feature is crafted to make learning
              irresistible.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI-Powered Personalization",
                desc: "Our AI learns how YOU learn best. It's like having a personal tutor who actually gets you.",
                icon: "🤖",
                gradient: "from-indigo-400 to-violet-500",
                bgGradient: "from-indigo-50 to-violet-50",
                delay: "0s",
              },
              {
                title: "Gamified Everything",
                desc: "XP, streaks, achievements, leaderboards. Learning has never been this addictive.",
                icon: "🎮",
                gradient: "from-sky-400 to-indigo-500",
                bgGradient: "from-sky-50 to-indigo-50",
                delay: "0.1s",
              },
              {
                title: "Bite-Sized Content",
                desc: "Perfect for your attention span. Learn during commutes, breaks, or whenever inspiration strikes.",
                icon: "⚡",
                gradient: "from-violet-400 to-fuchsia-500",
                bgGradient: "from-violet-50 to-fuchsia-50",
                delay: "0.2s",
              },
              {
                title: "Community Driven",
                desc: "Connect with peers, share progress, and learn together. Education is better with friends.",
                icon: "👥",
                gradient: "from-fuchsia-400 to-sky-500",
                bgGradient: "from-fuchsia-50 to-sky-50",
                delay: "0.3s",
              },
              {
                title: "Real-World Skills",
                desc: "From coding to creativity, we teach skills that actually matter in today's world.",
                icon: "🚀",
                gradient: "from-sky-400 to-violet-500",
                bgGradient: "from-sky-50 to-violet-50",
                delay: "0.4s",
              },
              {
                title: "Mobile-First Design",
                desc: "Learn anywhere, anytime. Our mobile experience is so good, you'll forget about desktop.",
                icon: "📱",
                gradient: "from-indigo-400 to-fuchsia-500",
                bgGradient: "from-indigo-50 to-fuchsia-50",
                delay: "0.5s",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative animate-fadeInUp hover:scale-105 hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: feature.delay }}
              >
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur transition-all duration-300`}
                />

                <div
                  className={`relative p-8 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 group-hover:border-white/50 transition-all duration-300 h-full group-hover:bg-white/80 shadow-lg group-hover:shadow-2xl overflow-hidden`}
                >
                  {/* Card pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.2) 1px, transparent 0)`,
                        backgroundSize: "16px 16px",
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`text-6xl mb-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-800 mb-4 group-hover:text-zinc-900">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed group-hover:text-zinc-700">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-4xl mx-auto text-center relative animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="absolute -inset-8 bg-gradient-to-r from-indigo-200/40 via-violet-200/40 to-sky-200/40 rounded-3xl blur-2xl animate-pulse" />

            <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 p-12 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-6">
                  Ready to Level Up?
                </h2>
                <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of students who've already transformed their
                  learning experience. Your future self will thank you.
                </p>

                <button className="group px-12 py-6 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 rounded-2xl font-bold text-xl text-white shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 relative overflow-hidden transform hover:scale-105 active:scale-95">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 via-violet-400 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Get Started Now
                    <span className="animate-pulse">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1.2);
          }
          50% {
            transform: translate(-40px, 40px) scale(1);
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.3);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
