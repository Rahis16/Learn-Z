"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

// Dummy user profiles
const profiles = [
    
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

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = profiles.find((p) => p.id === id);

  if (!profile) {
    return <p className="text-center mt-10 text-gray-500">Profile not found.</p>;
  }

  return (
    <div className="min-h-screen px-6 py-10  flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl rounded-3xl border border-white/30 backdrop-blur-xl shadow-2xl p-10"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-8 border-b border-white/20">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              {profile.name}
            </h1>
            <p className="text-base text-gray-600">{profile.faculty}</p>
            <p className="text-sm text-gray-500">{profile.location}</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 rounded-xl bg-white/50 border border-white/20 hover:bg-white/70 shadow-sm transition">
              Message
            </button>
            <button className="px-6 py-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90 transition">
              Add Friend
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "GPA", value: profile.gpa },
            { label: "Credits", value: profile.credits },
            { label: "Attendance", value: profile.attendance },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/70 rounded-2xl px-6 py-4 shadow-md border border-white/20"
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contact & Courses */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              Contact
            </h3>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <HiOutlineMail /> {profile.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <HiOutlinePhone /> {profile.phone}
            </p>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              Courses
            </h3>
            {profile.courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-white/70 border border-white/20 shadow-md flex justify-between items-center mb-3"
              >
                <span>{course.name}</span>
                <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-sm">
                  {course.grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}