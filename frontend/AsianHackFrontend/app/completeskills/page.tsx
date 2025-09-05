"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Code,
  Heart,
  Target,
  ArrowRight,
  SkipForward,
  Check,
  Plus,
  X,
  Search,
  Brain,
  Layers,
  ChevronLeft,
} from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

// Simulated axios function - no real API calls
// const axiosWithCsrf = {
//   post: async (url: string, data: any) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log(`[SIMULATED POST] ${url}`, data);
//         resolve({ data: { success: true } });
//       }, 1200);
//     });
//   },
// };

interface SkillsInterests {
  field: string | null;
  skills: string[];
  interests: string[];
  skill_level: { [key: string]: "Beginner" | "Intermediate" | "Advanced" };
}

type PendingAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "skip" }
  | { type: "submit" }
  | null;

// ---- Catalogs ----
const FIELDS = [
  "IT",
  "Medical",
  "Data Science",
  "Geology",
  "Business",
  "Education",
  "Finance",
  "Civil Engineering",
  "Mechanical Engineering",
  "Agriculture",
  "Law",
  "Hospitality",
  "Design",
  "Marketing",
];

const FIELD_INTERESTS: Record<string, string[]> = {
  IT: [
    "Web Development",
    "Mobile Apps",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Open Source",
    "AR/VR",
    "Game Development",
  ],
  "Data Science": [
    "Machine Learning",
    "Deep Learning",
    "Data Visualization",
    "MLOps",
    "NLP",
    "Computer Vision",
    "Big Data",
  ],
  Medical: [
    "Anatomy",
    "Public Health",
    "Medical Research",
    "Telemedicine",
    "Pharmacology",
    "Mental Health",
    "Biotech",
  ],
  Geology: [
    "Mineralogy",
    "Seismology",
    "Hydrology",
    "Petrology",
    "Geophysics",
    "Environmental Geology",
  ],
  Business: [
    "Entrepreneurship",
    "Operations",
    "Strategy",
    "Sales",
    "Human Resources",
    "Economics",
  ],
  Education: [
    "Pedagogy",
    "EdTech",
    "Curriculum Design",
    "Assessment",
    "Special Education",
    "Classroom Management",
  ],
  Finance: [
    "Investing",
    "Accounting",
    "FinTech",
    "Risk Management",
    "Corporate Finance",
    "Auditing",
  ],
  "Civil Engineering": [
    "Structural Design",
    "Transportation",
    "Construction Management",
    "Geotechnical",
    "Water Resources",
  ],
  "Mechanical Engineering": [
    "Thermodynamics",
    "Robotics",
    "CAD/CAM",
    "Manufacturing",
    "Automotive",
  ],
  Agriculture: [
    "AgriTech",
    "Horticulture",
    "Irrigation",
    "Sustainable Farming",
    "Soil Science",
  ],
  Law: [
    "Corporate Law",
    "Criminal Law",
    "Constitutional Law",
    "IP Law",
    "Contract Law",
  ],
  Hospitality: [
    "Tourism",
    "Culinary Arts",
    "Event Management",
    "Hotel Operations",
  ],
  Design: [
    "UI/UX",
    "Graphic Design",
    "Product Design",
    "Motion Graphics",
    "3D Design",
  ],
  Marketing: [
    "Digital Marketing",
    "SEO",
    "Content Strategy",
    "Branding",
    "Market Research",
  ],
};

const FIELD_SKILLS: Record<string, string[]> = {
  IT: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "HTML/CSS",
    "Next.js",
    "Docker",
    "Kubernetes",
    "AWS",
    "Linux",
  ],
  "Data Science": [
    "Python",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "SQL",
    "Data Visualization",
  ],
  Medical: [
    "Clinical Research",
    "Patient Care",
    "Diagnostics",
    "Medical Writing",
    "Biostatistics",
  ],
  Geology: [
    "GIS",
    "ArcGIS",
    "Field Mapping",
    "Seismic Interpretation",
    "Remote Sensing",
  ],
  Business: [
    "Project Management",
    "Excel Modeling",
    "Negotiation",
    "Business Analysis",
  ],
  Education: [
    "Lesson Planning",
    "Classroom Tech",
    "Educational Psychology",
    "Assessment Design",
  ],
  Finance: [
    "Financial Modeling",
    "Accounting",
    "Valuation",
    "Audit Procedures",
    "Risk Analysis",
  ],
  "Civil Engineering": [
    "AutoCAD",
    "STAAD Pro",
    "Revit",
    "Structural Analysis",
    "Surveying",
  ],
  "Mechanical Engineering": [
    "SolidWorks",
    "MATLAB",
    "CNC",
    "Thermal Analysis",
    "Mechatronics",
  ],
  Agriculture: [
    "Crop Management",
    "Soil Testing",
    "Agri Economics",
    "Supply Chain",
  ],
  Law: ["Legal Research", "Contract Drafting", "Case Analysis", "Advocacy"],
  Hospitality: [
    "Customer Service",
    "Event Planning",
    "Food Safety",
    "Revenue Management",
  ],
  Design: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "Prototyping"],
  Marketing: [
    "SEO",
    "Google Analytics",
    "Copywriting",
    "Campaign Planning",
    "Social Media",
  ],
};

// Fallback populars (used if user hasn’t picked a field yet)
const POPULAR_INTERESTS = [
  "Technology",
  "Artificial Intelligence",
  "Startups",
  "Entrepreneurship",
  "Web Development",
  "Mobile Apps",
  "Gaming",
  "Blockchain",
  "IoT",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Open Source",
  "Design",
  "Music",
  "Travel",
  "Sports",
  "Reading",
  "Movies",
  "Art",
];

const POPULAR_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "HTML/CSS",
  "Java",
  "C++",
  "PHP",
  "Machine Learning",
  "Data Analysis",
  "UI/UX Design",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Database Management",
  "Project Management",
  "Digital Marketing",
  "Content Writing",
  "Photography",
];

export default function SkillsInterestsSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const [data, setData] = useState<SkillsInterests>({
    field: null,
    skills: [],
    interests: [],
    skill_level: {},
  });

  // Custom input states
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // Simulated network action orchestrated by useEffect
  const [pending, setPending] = useState<PendingAction>(null);
  const [loadingAction, setLoadingAction] = useState<PendingAction>(null);

  const [apiInterests, setApiInterests] = useState<string[] | null>(null);
  const [apiSkills, setApiSkills] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalSteps = 3;

  // Derived option lists based on field
  const interestOptions = useMemo(() => {
    if (data.field && FIELD_INTERESTS[data.field])
      return FIELD_INTERESTS[data.field];
    return POPULAR_INTERESTS;
  }, [data.field]);

  const skillOptions = useMemo(() => {
    if (data.field && FIELD_SKILLS[data.field]) return FIELD_SKILLS[data.field];
    return POPULAR_SKILLS;
  }, [data.field]);

  // --- useEffect to call REAL backend APIs triggered by button intents ---
  useEffect(() => {
    if (!pending) return;

    const run = async () => {
      setLoadingAction(pending); // lock UI for this specific action
      setErrorMsg?.(null); // clear any previous error (safe if you added errorMsg)

      try {
        if (pending.type === "next") {
          // If moving from Step 1 -> Step 2 and a field is chosen, fetch field-specific catalogs
          if (currentStep === 1 && data.field) {
            const [interestsRes, skillsRes] = await Promise.all([
              axiosWithCsrf.get("/api/catalog/interests/", {
                params: { field: data.field },
              }),
              axiosWithCsrf.get("/api/catalog/skills/", {
                params: { field: data.field },
              }),
            ]);
            setApiInterests?.(
              (interestsRes.data || []).map((i: any) => i.name)
            );
            setApiSkills?.((skillsRes.data || []).map((s: any) => s.name));
          }
          setCurrentStep((s) => Math.min(s + 1, totalSteps));
        } else if (pending.type === "prev") {
          setCurrentStep((s) => Math.max(s - 1, 1));
        } else if (pending.type === "skip") {
          setIsCompleted(true);
        } else if (pending.type === "submit") {
          // Final save to DRF
          const payload = {
            field: data.field,
            interests: data.interests,
            skills: data.skills,
            skill_level: data.skill_level,
          };
          await axiosWithCsrf.post("/api/save-skills-interests/", payload);
          setIsCompleted(true);
        }
      } catch (e: any) {
        console.error("Request failed:", e);
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.non_field_errors?.[0] ||
          "Something went wrong. Please try again.";
        setErrorMsg?.(msg);
      } finally {
        setLoadingAction(null);
        setPending(null);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Boolean(data.field);
      case 2:
        return data.interests.length > 0;
      case 3:
        return data.skills.length > 0;
      default:
        return false;
    }
  };

  const handleAddCustom = (type: "skills" | "interests", value: string) => {
    if (value.trim() && !data[type].includes(value.trim())) {
      setData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
      if (type === "skills") setSkillInput("");
      if (type === "interests") setInterestInput("");
    }
  };

  const handleToggleItem = (type: "skills" | "interests", item: string) => {
    setData((prev) => {
      const exists = prev[type].includes(item);
      const nextList = exists
        ? prev[type].filter((i) => i !== item)
        : [...prev[type], item];

      const next: SkillsInterests = { ...prev, [type]: nextList };

      // If removing a skill, also drop its level
      if (type === "skills" && exists && prev.skill_level[item]) {
        const { [item]: _omit, ...rest } = prev.skill_level;
        next.skill_level = rest;
      }

      // Auto-assign default level when adding a skill (nice touch)
      if (type === "skills" && !exists) {
        next.skill_level = { ...prev.skill_level, [item]: "Beginner" };
      }

      return next;
    });
  };

  const handleRemoveItem = (type: "skills" | "interests", item: string) => {
    setData((prev) => {
      const newState: SkillsInterests = {
        ...prev,
        [type]: prev[type].filter((i) => i !== item),
      };
      if (type === "skills") {
        const { [item]: _removed, ...rest } = prev.skill_level;
        newState.skill_level = rest;
      }
      return newState;
    });
  };

  const handleFieldSelect = (field: string) => {
    // When changing field, clear existing choices so the flow stays relevant
    setData((prev) => ({
      field,
      interests: [],
      skills: [],
      skill_level: {},
    }));
  };

  const setSkillLevel = (
    skill: string,
    level: "Beginner" | "Intermediate" | "Advanced"
  ) => {
    setData((prev) => ({
      ...prev,
      skill_level: { ...prev.skill_level, [skill]: level },
    }));
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold flex justify-center items-center gap-2 text-gray-900 mb-4">
            Awesome! <Brain className="w-9 h-9 text-green-600" />
          </h2>
          <p className="text-gray-600 mb-8">
            Your field, interests, and skills have been saved. We&apos;ll use
            this to personalize your experience!
          </p>
          <button
            onClick={() => (location.href = "/dashboard")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Explore Platform
          </button>
        </div>
      </div>
    );
  }

  // Button loading helpers
  const isLoading = (t: PendingAction["type"]) =>
    loadingAction && loadingAction.type === t;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Share Your Passions</h1>
              <p className="text-purple-100">
                Step {currentStep} of {totalSteps} — Let&apos;s discover what
                drives you
              </p>
            </div>

            <button
              onClick={() => setPending({ type: "skip" })}
              disabled={isLoading("skip")}
              className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors disabled:opacity-60"
            >
              {isLoading("skip") ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SkipForward className="w-4 h-4" />
              )}
              Skip for now
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-purple-400/50 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Field */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Layers className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose Your Field
                </h2>
                <p className="text-gray-600">
                  Pick the domain you&apos;re most focused on
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FIELDS.map((f) => {
                  const active = data.field === f;
                  return (
                    <button
                      key={f}
                      onClick={() => handleFieldSelect(f)}
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        active
                          ? "bg-purple-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Interests (filtered by field) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What interests you?
                </h2>
                <p className="text-gray-600">
                  Select topics and areas you&apos;re passionate about{" "}
                  {data.field ? `in ${data.field}` : ""}
                </p>
              </div>

              {/* Custom Interest Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder={`Add a custom interest${
                      data.field ? ` for ${data.field}` : ""
                    }...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleAddCustom("interests", interestInput)
                    }
                  />
                </div>
                <button
                  onClick={() => handleAddCustom("interests", interestInput)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Interests */}
              {data.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Interests:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm"
                      >
                        {interest}
                        <button
                          onClick={() =>
                            handleRemoveItem("interests", interest)
                          }
                          className="text-pink-600 hover:text-pink-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interest Options */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {data.field
                    ? `${data.field} Interests:`
                    : "Popular Interests:"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleToggleItem("interests", interest)}
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        data.interests.includes(interest)
                          ? "bg-pink-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills (filtered by field) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Code className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What are your skills?
                </h2>
                <p className="text-gray-600">
                  Add your technical and professional skills{" "}
                  {data.field ? `for ${data.field}` : ""}
                </p>
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder={`Add a custom skill${
                      data.field ? ` for ${data.field}` : ""
                    }...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddCustom("skills", skillInput)
                    }
                  />
                </div>
                <button
                  onClick={() => handleAddCustom("skills", skillInput)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Skills + level pickers */}
              {data.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Skills:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {skill}
                        <select
                          value={data.skill_level[skill] || "Beginner"}
                          onChange={(e) =>
                            setSkillLevel(
                              skill,
                              e.target.value as
                                | "Beginner"
                                | "Intermediate"
                                | "Advanced"
                            )
                          }
                          className="bg-white border border-purple-300 rounded-full text-xs px-2 py-1 focus:outline-none"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                        <button
                          onClick={() => handleRemoveItem("skills", skill)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Options */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {data.field ? `${data.field} Skills:` : "Popular Skills:"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleToggleItem("skills", skill)}
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        data.skills.includes(skill)
                          ? "bg-purple-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() => setPending({ type: "prev" })}
              disabled={currentStep === 1 || isLoading("prev")}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-60"
              }`}
            >
              {isLoading("prev") ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Going back...
                </>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </>
              )}
            </button>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <button
                  onClick={() => setPending({ type: "skip" })}
                  disabled={isLoading("skip")}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-60"
                >
                  {isLoading("skip") ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "Skip this step"
                  )}
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={() => setPending({ type: "next" })}
                  disabled={!isStepValid() || isLoading("next")}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all ${
                    isStepValid()
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 disabled:transform-none disabled:opacity-60"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading("next") ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setPending({ type: "submit" })}
                  disabled={isLoading("submit")}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading("submit") ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i + 1 <= currentStep
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}