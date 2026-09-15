import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { getProductById } from "../../data/productApi";
import { Product } from "../../types/Product";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProductById(Number(id));

      setProduct(data);
    } catch (err) {
      setError("Unable to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.stateText}>Loading product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>

        <Text style={styles.stateText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={loadProduct}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>{product.title}</Text>

      <FlatList
        data={product.images}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageList}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
      />

      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      <Text style={styles.rating}>Rating: {product.rating} / 5</Text>

      <Text style={styles.sectionTitle}>Description</Text>

      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 20,
    paddingTop: 50,
  },

  backButton: {
    marginBottom: 20,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  imageList: {
    marginBottom: 20,
  },

  productImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#eeeeee",
  },

  price: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },

  rating: {
    fontSize: 17,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },

  stateText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#222222",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  retryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
