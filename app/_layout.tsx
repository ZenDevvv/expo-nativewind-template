import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="details"
        options={{
          title: "Details",
          headerBackButtonDisplayMode: "minimal",
          presentation: "pageSheet",
        }}
      />
    </Stack>
  );
}
