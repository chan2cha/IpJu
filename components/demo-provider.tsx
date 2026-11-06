"use client";
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { mockExpenses, mockFunding, mockTasks } from "@/lib/mock-data";
import type { Task, Expense, Funding } from "@/lib/models";
type DemoState = {
  tasks: Task[]; setTasks: Dispatch<SetStateAction<Task[]>>;
  expenses: Expense[]; setExpenses: Dispatch<SetStateAction<Expense[]>>;
  funding: Funding[]; setFunding: Dispatch<SetStateAction<Funding[]>>;
  moveInDate: string; setMoveInDate: Dispatch<SetStateAction<string>>;
  activity: string; setActivity: Dispatch<SetStateAction<string>>;
};
const DemoContext = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  // 시제품의 입력은 메모리에만 두어 실제 저장·공유로 오해하지 않게 한다.
  const [tasks, setTasks] = useState(mockTasks);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [funding, setFunding] = useState(mockFunding);
  const [moveInDate, setMoveInDate] = useState("2026-12-20");
  const [activity, setActivity] = useState("가전 구매 계약금 500,000원 기록 · 예시");
  return <DemoContext.Provider value={{ tasks, setTasks, expenses, setExpenses, funding, setFunding, moveInDate, setMoveInDate, activity, setActivity }}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider가 필요합니다.");
  return context;
}
