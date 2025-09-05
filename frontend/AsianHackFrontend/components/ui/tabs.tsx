"use client";

import * as React from "react";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<any>(null);

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-2">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex border-b border-gray-200 dark:border-gray-700">{children}</div>;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  const { activeTab, setActiveTab } = context;

  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 -mb-px font-medium text-sm border-b-2 transition-all ${
        isActive
          ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <div className="mt-4">{children}</div>;
}