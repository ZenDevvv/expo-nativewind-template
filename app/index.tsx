import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Loading } from "../components/Loading";
import { PokemonCard } from "../components/PokemonCard";

export default function Index() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchPokemon = async (currentOffset: number, isLoadMore = false) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`,
      );
      const json = await response.json();

      if (json.results.length === 0) {
        setHasMore(false);
        return;
      }

      const detailedResponse = await Promise.all(
        json.results.map(async (item: any) => {
          const res = await fetch(item.url);
          const data = await res.json();
          return {
            name: item.name,
            image: data.sprites.front_default,
            imageBack: data.sprites.back_default,
          };
        }),
      );

      setData((prev) =>
        isLoadMore ? [...prev, ...detailedResponse] : detailedResponse,
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchPokemon(0);
      setIsLoading(false);
    };
    init();
  }, []);

  const loadMore = async () => {
    if (!hasMore || isFetchingMore || isLoading) return;

    setIsFetchingMore(true);
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    await fetchPokemon(newOffset, true);
    setIsFetchingMore(false);
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View className="py-4 justify-center items-center">
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text className="text-gray-500 text-xs mt-1">Loading more...</Text>
      </View>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-100 px-2 pt-4">
      <Stack.Screen
        options={{
          title: "Pokédex",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f3f4f6" },
          headerTintColor: "#000",
          headerTitleAlign: "center",
        }}
      />
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.name}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <PokemonCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
