import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Details() {
  const { name } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [pokemonRes, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`),
        ]);

        const pokemonData = await pokemonRes.json();
        const speciesData = await speciesRes.json();

        setDetails(pokemonData);
        setSpecies(speciesData);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  if (loading || !details) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const mainType = details.types[0].type.name;
  const themeColor = TYPE_COLORS[mainType] || "#A8A77A";
  const description =
    species?.flavor_text_entries
      ?.find((entry: any) => entry.language.name === "en")
      ?.flavor_text?.replace(/[\n\f]/g, " ") || "No description available.";

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "#fff",
        }}
      />
      <ScrollView className="flex-1 bg-white">
        {/* Header Section */}
        <View
          className="w-full h-[400px] items-center justify-end rounded-b-[40px] shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <View className="absolute top-24 opacity-20">
            <Text className="text-9xl font-extrabold text-white tracking-widest uppercase">
              {mainType}
            </Text>
          </View>
          <Image
            source={{
              uri: details.sprites.other["official-artwork"].front_default,
            }}
            className="w-72 h-72 mb-[-30px] z-10"
            resizeMode="contain"
          />
        </View>

        {/* Info Section */}
        <View className="mt-12 px-6 pb-10">
          <Text className="text-4xl font-extrabold text-center capitalize text-gray-800">
            {name}
          </Text>

          {/* Types */}
          <View className="flex-row justify-center gap-3 mt-4">
            {details.types.map((t: any) => (
              <View
                key={t.type.name}
                className="px-4 py-1.5 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[t.type.name] }}
              >
                <Text className="text-white font-bold capitalize text-sm">
                  {t.type.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text className="text-center text-gray-600 mt-6 leading-6 text-base px-4">
            {description}
          </Text>

          {/* Base Stats */}
          <View className="mt-8 bg-gray-50 p-6 rounded-3xl">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Base Stats
            </Text>
            {details.stats.map((stat: any) => {
              const value = stat.base_stat;
              const maxStat = 255;
              const percentage = (value / maxStat) * 100;

              return (
                <View
                  key={stat.stat.name}
                  className="flex-row items-center mb-3"
                >
                  <Text className="w-24 text-gray-500 capitalize font-medium text-sm">
                    {stat.stat.name.replace("-", " ")}
                  </Text>
                  <Text className="w-10 text-gray-800 font-bold text-right mr-3">
                    {value}
                  </Text>
                  <View className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: themeColor,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Physical Stats */}
          <View className="flex-row justify-between mt-6 px-4">
            <View className="items-center bg-gray-50 p-4 rounded-2xl w-[48%]">
              <Text className="text-gray-500 text-sm">Weight</Text>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {details.weight / 10} kg
              </Text>
            </View>
            <View className="items-center bg-gray-50 p-4 rounded-2xl w-[48%]">
              <Text className="text-gray-500 text-sm">Height</Text>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {details.height / 10} m
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
