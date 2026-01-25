import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PokemonCardProps {
  item: {
    name: string;
    image: string;
  };
}

export const PokemonCard = ({ item }: PokemonCardProps) => {
  return (
    <Link href={{ pathname: "/details", params: { name: item.name } }} asChild>
      <TouchableOpacity className="flex-1 bg-white dark:bg-gray-800 m-2 rounded-2xl shadow-sm p-4 items-center justify-between border border-gray-200 dark:border-gray-700">
        <View className="relative w-full items-center">
          <View className="absolute w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full -z-10 top-2" />
          <Image
            source={{ uri: item.image }}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>

        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 capitalize mt-2">
          {item.name}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
