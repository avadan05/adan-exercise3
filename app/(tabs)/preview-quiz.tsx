import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuiz } from "../../context/QuizContext";

export default function PreviewQuiz() {
  const router = useRouter();
  const { items: questions, timer } = useQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(timer);

  const question = questions[currentIndex];

  // Update timeLeft whenever the timer changes in settings
  useEffect(() => {
    setTimeLeft(timer);
  }, [timer]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/result?score=${score}`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleAnswer = (choice: string) => {
    const updated = { ...answers, [String(question.id)]: choice };
    setAnswers(updated);

    let newScore = 0;
    questions.forEach((q) => {
      if (updated[String(q.id)] === q.answer) newScore++;
    });
    setScore(newScore);
  };

  const nextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      router.push(`/result?score=${score}`);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!question) return <Text>No Questions</Text>;

  return (
    <View style={styles.container}>
      <Text>Time Left: {timeLeft}s</Text>

      <Text style={styles.question}>
        {currentIndex + 1}. {question.question}
      </Text>

      {Object.entries(question.choices).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.choice,
            answers[String(question.id)] === key && styles.selected,
          ]}
          onPress={() => handleAnswer(key)}
        >
          <Text>{key}. {value}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={previousQuestion}
          disabled={currentIndex === 0}
        >
          <Text
            style={[
              styles.buttonText,
              currentIndex === 0 && { color: "gray" },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextQuestion}>
          <Text style={styles.buttonText}>
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  question: { fontSize: 18, marginVertical: 15 },
  choice: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  selected: { backgroundColor: "#cce5ff" },
  buttonText: { fontSize: 16, color: "blue", marginTop: 20 },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});