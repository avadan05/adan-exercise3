import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useQuiz } from "../../context/QuizContext";

export default function QuizSettings() {
  const { items, addItem, editItem, deleteItem, timer, setTimer } = useQuiz();
  const [text, setText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const handleSave = () => {
    if (text.trim()) {
      if (editingId) {
        editItem(editingId, text);
        setEditingId(null);
      } else {
        addItem(text);
      }
      setText("");
    }
  };

  const handleCancel = () => {
    setText("");
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Quiz Settings</Text>

      {/* Timer Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quiz Duration</Text>
        <View style={styles.timerInputGroup}>
          <TextInput
            keyboardType="numeric"
            value={String(timer)}
            onChangeText={(val) => setTimer(Number(val))}
            style={styles.timerInput}
            placeholderTextColor="#999"
          />
          <Text style={styles.timerLabel}>seconds</Text>
        </View>
      </View>

      {/* Questions Section */}
      <View style={[styles.section, { flex: 1 }]}>
        <Text style={styles.sectionTitle}>Questions ({items.length})</Text>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TextInput
            placeholder="Enter new question..."
            value={text}
            onChangeText={setText}
            style={styles.textInput}
            placeholderTextColor="#ccc"
            multiline
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, editingId ? styles.updateButton : styles.addButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                {editingId ? "Update" : "Add Question"}
              </Text>
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Questions List */}
        {items.length > 0 ? (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.questionItem}>
                <View style={styles.questionContent}>
                  <Text style={styles.questionIndex}>{index + 1}.</Text>
                  <Text style={styles.questionText}>{item.question}</Text>
                </View>
                <View style={styles.itemButtons}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.editBtn]}
                    onPress={() => {
                      setEditingId(item.id);
                      setText(item.question);
                    }}
                  >
                    <Text style={styles.iconButtonText}>✎</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.deleteBtn]}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Text style={styles.iconButtonText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={true}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No questions yet. Add one to get started!</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  timerInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timerInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  timerLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  inputArea: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#34C759",
  },
  updateButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  questionItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  questionContent: {
    flex: 1,
    flexDirection: "row",
    marginRight: 8,
  },
  questionIndex: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007AFF",
    marginRight: 8,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  itemButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "#007AFF",
  },
  deleteBtn: {
    backgroundColor: "#ff3b30",
  },
  iconButtonText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
});