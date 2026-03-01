import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function ResultScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Quiz Completed 🎉</Text>
      <Text>Your Score: {score}</Text>
      <Button title="Back to Quiz" onPress={() => router.replace("/preview-quiz")} />
    </View>
  );
}