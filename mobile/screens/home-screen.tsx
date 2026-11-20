import { IconSchool } from "@tabler/icons-react-native"
import LottieView from "lottie-react-native"
import { Text, View } from "react-native"

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <LottieView
        source={require("../assets/placeholder.json")}
        autoPlay
        loop
        style={{ width: 96, height: 96 }}
      />
      <IconSchool size={28} color="#171717" />
      <Text className="text-center text-2xl font-semibold text-foreground">
        MMK School
      </Text>
      <Text className="text-center text-base text-muted-foreground">
        One mobile app for teachers, students, and parents.
      </Text>
    </View>
  )
}
