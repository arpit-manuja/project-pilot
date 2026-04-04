import { getAllQuestions } from "@/lib/questions-db";
import PracticePage from "./practice-client";

export default async function PracticePageServer() {
  const allQuestions = await getAllQuestions();
  return <PracticePage allQuestions={allQuestions} />;
}
