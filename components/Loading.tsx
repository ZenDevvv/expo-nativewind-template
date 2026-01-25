import { ActivityIndicator, Text, View } from "react-native";

export const Loading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-gray-500 mt-2">Loading Pokémon...</Text>
    </View>
  );
};
