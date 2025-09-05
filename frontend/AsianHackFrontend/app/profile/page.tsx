"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import Link from "next/link";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import UpdateProfileModal from "@/components/profile/ProfileEditPopup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface StudentProfile {
  id: number;
  username: string;
  photo: string;
  semester: number;
  faculty: string;
  year?: number; // optional since your example didn't show it explicitly but may exist
  background: string;
  bio: string;
  college: string;
  contact_number: string;
  gender: string;
  lcid: string;
  perm_address: string;
  temp_address: string;
  school: string;
  user: number;
  full_name: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();

  const fetchprofile = async () => {
    try {
      const { data } = await axiosWithCsrf("/my-profile/");

      setProfile(data);
      console.log("Profile data:", data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchprofile();
  }, []);

  // Dummy data
  const courses = [
    { id: 1, name: "Advanced Web Development", credits: 3, grade: "A" },
    { id: 2, name: "Machine Learning Basics", credits: 4, grade: "B+" },
    { id: 3, name: "Database Management Systems", credits: 3, grade: "A-" },
  ];

  const groups = [
    { id: 1, name: "AI Enthusiasts", role: "Member", members: 24 },
    { id: 2, name: "Full-Stack Devs", role: "Admin", members: 18 },
  ];

  const friends = [
    {
      id: "1",
      name: "Aarav Sharma",
      faculty: "Computer Science – Senior",
      location: "Sydney, Australia",
      email: "aarav@example.com",
      phone: "+977 9876543210",
      avatar: "/images/profile2.jpg",
      gpa: "3.8",
      credits: "92",
      attendance: "96%",
      skills: ["React", "Node.js", "MongoDB", "UI/UX Design"],
      courses: [
        { id: 1, name: "React Development", credits: 3, grade: "A" },
        { id: 2, name: "AI Fundamentals", credits: 4, grade: "B+" },
      ],
    },
    {
      id: "2",
      name: "Priya Khadka",
      faculty: "Information Systems – Junior",
      location: "Kathmandu, Nepal",
      email: "priya@example.com",
      phone: "+977 9812345678",
      avatar: "/images/profile2.jpg",
      gpa: "3.9",
      credits: "80",
      attendance: "94%",
      skills: ["Python", "Data Analysis", "Machine Learning", "SQL"],
      courses: [
        { id: 1, name: "Database Management", credits: 3, grade: "A" },
        { id: 2, name: "Python for Data Science", credits: 4, grade: "A-" },
      ],
    },
    {
      id: "3",
      name: "Rohan Thapa",
      faculty: "Network Engineering – Senior",
      location: "Melbourne, Australia",
      email: "rohan@example.com",
      phone: "+61 456 789 012",
      avatar: "/images/profile2.jpg",
      gpa: "3.7",
      credits: "88",
      attendance: "91%",
      skills: ["Cybersecurity", "Linux", "Cloud Computing", "Networking"],
      courses: [
        { id: 1, name: "Advanced Networking", credits: 3, grade: "A-" },
        { id: 2, name: "Cloud Infrastructure", credits: 4, grade: "B+" },
      ],
    },
    {
      id: "4",
      name: "Sita Adhikari",
      faculty: "Software Engineering – Sophomore",
      location: "Pokhara, Nepal",
      email: "sita@example.com",
      phone: "+977 9801234567",
      avatar: "/images/profile2.jpg",
      gpa: "3.6",
      credits: "65",
      attendance: "89%",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Git"],
      courses: [
        { id: 1, name: "Java Programming", credits: 3, grade: "A" },
        { id: 2, name: "Database Systems", credits: 4, grade: "B+" },
      ],
    },
    {
      id: "5",
      name: "Kiran Lama",
      faculty: "Artificial Intelligence – Senior",
      location: "Brisbane, Australia",
      email: "kiran@example.com",
      phone: "+61 400 123 456",
      avatar: "/images/profile2.jpg",
      gpa: "4.0",
      credits: "100",
      attendance: "98%",
      skills: ["Deep Learning", "Computer Vision", "Python", "TensorFlow"],
      courses: [
        { id: 1, name: "Deep Learning", credits: 3, grade: "A+" },
        { id: 2, name: "Computer Vision", credits: 4, grade: "A" },
      ],
    },
  ];

  const friendRequests = [
    { id: 1, name: "Rohan Thapa", faculty: "Network Engineering" },
  ];

  return (
    <div className="min-h-screen px-6 py-10 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-10"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-8 border-b border-white/20 dark:border-white/10">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <Image
              src={profile?.photo || "/images/profile2.jpg"}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">@{profile?.username}</p>
            <h1 className="text-3xl font-bold bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              {profile?.full_name}
            </h1>
            <p className="text-sm text-gray-500 mt-2">{profile?.bio}</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => router.push('/chatpage')} className="px-6 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-white/20 hover:bg-white/70 dark:hover:bg-zinc-900/70 shadow-sm transition">
              Message
            </button>
            <button onClick={() => setOpenModal(true)} className="px-6 py-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Semester", value: profile?.semester || "N/A" },
            { label: "Credits", value: "98" },
            { label: "Attendance", value: "95%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/70 dark:bg-zinc-900/70 rounded-2xl px-6 py-4 shadow-md border border-white/20"
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="scrollbar overflow-x-auto mt-10 flex justify-center gap-8 border-b border-white/20 dark:border-white/10">
          {["overview", "courses", "groups", "friends", "friendRequest"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-base capitalize transition-all ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-500 text-indigo-500"
                    : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
                Contact
              </h3>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineMail /> heydev@example.com
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlinePhone /> {profile?.contact_number || "N/A"}
              </p>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-3">
                Availability
              </h3>
              <p className="text-sm text-gray-500">Unavailable</p>
              <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full mb-4">
                <div className="w-1/4 h-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500">Wednesday</p>
              <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full">
                <div className="w-3/4 h-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 rounded-full"></div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-3">
                Quick Links
              </h3>
              <a
                href="#"
                className="block text-sm text-indigo-500 hover:underline"
              >
                Academic Resources
              </a>
              <a
                href="#"
                className="block text-sm text-indigo-500 hover:underline"
              >
                Student Portal
              </a>
            </div>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="mt-8 space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-md flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{course.name}</h4>
                  <p className="text-sm text-gray-500">
                    {course.credits} Credits
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-sm">
                  Grade: {course.grade}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Groups */}
        {activeTab === "groups" && (
          <div className="mt-8 space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-md flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{group.name}</h4>
                  <p className="text-sm text-gray-500">Role: {group.role}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-sm">
                  {group.members} Members
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Friends */}
        {activeTab === "friends" && (
          <div className="mt-8 space-y-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-5 transition hover:shadow-xl"
              >
                {/* Avatar */}
                <Link href={`/profile/${friend.id}`}>
                  <Image
                    src="/images/profile2.jpg"
                    alt={friend.name}
                    width={60}
                    height={60}
                    className="rounded-full border-4 border-white shadow-md"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {friend.name}
                  </h2>
                  <p className="text-sm text-gray-500">{friend.faculty}</p>
                </div>

                {/* Action Button */}
                <button className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white hover:opacity-90 transition">
                  Message
                </button>
              </div>
            ))}

            {friends.length === 0 && (
              <p className="text-center text-gray-500">No friends found.</p>
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeTab === "friendRequest" && (
          <div className="mt-8 space-y-4">
            {friendRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-md flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{req.name}</h4>
                  <p className="text-sm text-gray-500">{req.faculty}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      <UpdateProfileModal open={openModal} onUpdate={() => {
        toast.success("Profile updated successfully!");
        fetchprofile();
      }} 
      onClose={() => setOpenModal(false)} />
    </div>
  );
}