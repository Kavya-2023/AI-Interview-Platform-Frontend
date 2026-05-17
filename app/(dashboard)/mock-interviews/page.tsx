"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES = ["Frontend", "Backend", "Full Stack", "DevOps", "Data Science"];
const EXPERIENCE_LEVELS = ["0-2 Years", "2-5 Years", "5+ Years"];
const TOPICS = ["React", "Node.js", "System Design", "DSA", "TypeScript", "Python"];

export default function MockInterviewsPage() {
  const router = useRouter();
  const [role, setRole] = useState("Frontend");
  const [experience, setExperience] = useState("0-2 Years");
  const [topic, setTopic] = useState("React");
  const [numQuestions, setNumQuestions] = useState(5);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#1a2f5e] mb-6">
        Start Your Mock Interview
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
        <FormField label="Select Role">
          <Select
            value={role}
            onChange={setRole}
            options={ROLES}
          />
        </FormField>

        <FormField label="Experience Level">
          <Select
            value={experience}
            onChange={setExperience}
            options={EXPERIENCE_LEVELS}
          />
        </FormField>

        <FormField label="Select Topic">
          <Select
            value={topic}
            onChange={setTopic}
            options={TOPICS}
          />
        </FormField>

        <FormField label="Number of Questions">
          <input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-24 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#3b5bdb] transition"
          />
        </FormField>

        <button
          type="button"
          onClick={() => router.push("/mock-interviews/session")}
          className="w-full py-3 bg-[#28a745] text-white font-semibold rounded-lg hover:bg-[#218838] transition mt-1"
        >
          Generate Questions
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none outline-none focus:border-[#3b5bdb] transition bg-white cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
