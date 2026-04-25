import { getAllQuestions } from "@/lib/questions-db";
import PracticePage from "./practice-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function PracticePageServer() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "guest";
  const allQuestions = await getAllQuestions();
  return <PracticePage allQuestions={allQuestions} userEmail={userEmail} />;
}
