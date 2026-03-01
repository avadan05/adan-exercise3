import { Tabs } from "expo-router";
import { QuizProvider } from "../../context/QuizContext";

export default function Layout() {
  return (
    <QuizProvider>
      <Tabs screenOptions={{ headerShown: true }}>
        <Tabs.Screen
          name="preview-quiz"
          options={{ title: "Preview Quiz" }}
        />
        <Tabs.Screen
          name="quiz-settings"
          options={{ title: "Quiz Settings" }}
        />
      </Tabs>
    </QuizProvider>
  );
}