import type { ReactNode } from "react"
import { View } from "react-native"

type GluestackUIProviderProps = {
  children: ReactNode
}

export function GluestackUIProvider({ children }: GluestackUIProviderProps) {
  return <View className="flex-1 bg-background">{children}</View>
}
