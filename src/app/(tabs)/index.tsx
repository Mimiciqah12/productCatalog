import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getProducts } from "@/data/productApi";
import { Product } from "@/types/Product";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProducts();

      setProducts(data.products);
    } catch (err) {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.stateText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>

        <Text style={styles.stateText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No products found</Text>

        <Text style={styles.stateText}>
          There are currently no products to display.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>

      <Text style={styles.subtitle}>Discover our products</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              console.log("Product clicked:", item.id);

              router.push({
                pathname: "/product/[id]",
                params: { id: item.id.toString() },
              });
            }}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.productImage}
            />

            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 15,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#eeeeee",
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
  },

  productTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
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

  emptyTitle: {
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
