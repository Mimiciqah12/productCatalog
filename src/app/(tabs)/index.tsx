import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { getProducts, searchProducts } from "../../data/productApi";

import { Product } from "../../types/Product";

import ProductImage from "../../components/ProductImage";

const PAGE_SIZE = 20;

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;

      if (debouncedQuery) {
        data = await searchProducts(debouncedQuery, PAGE_SIZE, 0);
      } else {
        data = await getProducts(PAGE_SIZE, 0);
      }

      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loading || loadingMore || products.length >= total) {
      return;
    }

    try {
      setLoadingMore(true);
      setLoadMoreError(false);

      const nextSkip = products.length;

      let data;

      if (debouncedQuery) {
        data = await searchProducts(debouncedQuery, PAGE_SIZE, nextSkip);
      } else {
        data = await getProducts(PAGE_SIZE, nextSkip);
      }

      setProducts((currentProducts) => [...currentProducts, ...data.products]);

      setTotal(data.total);
    } catch (err) {
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshProducts = async () => {
    try {
      setRefreshing(true);

      let data;

      if (debouncedQuery) {
        data = await searchProducts(debouncedQuery, PAGE_SIZE, 0);
      } else {
        data = await getProducts(PAGE_SIZE, 0);
      }

      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      console.log("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [debouncedQuery]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>

      <Text style={styles.subtitle}>Discover our products</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No products found</Text>

          <Text style={styles.stateText}>
            {debouncedQuery
              ? `No results for "${debouncedQuery}".`
              : "There are currently no products to display."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={refreshProducts}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: {
                    id: item.id.toString(),
                  },
                })
              }
            >
              <ProductImage uri={item.thumbnail} style={styles.productImage} />

              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <Text style={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </Pressable>
          )}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator />

                <Text style={styles.footerText}>Loading more products...</Text>
              </View>
            ) : loadMoreError ? (
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Unable to load more products.
                </Text>

                <Pressable
                  style={styles.smallRetryButton}
                  onPress={loadMoreProducts}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : products.length >= total ? (
              <Text style={styles.endText}>You have reached the end.</Text>
            ) : null
          }
        />
      )}
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

  searchInput: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    fontSize: 16,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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

  smallRetryButton: {
    marginTop: 10,
    backgroundColor: "#222222",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  retryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },

  footerText: {
    marginTop: 8,
    fontSize: 14,
  },

  endText: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 14,
  },
});
