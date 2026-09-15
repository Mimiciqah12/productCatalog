import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ImageStyle,
    StyleProp,
    StyleSheet,
    Text,
    View,
} from "react-native";

type ProductImageProps = {
  uri: string;
  style?: StyleProp<ImageStyle>;
};

export default function ProductImage({ uri, style }: ProductImageProps) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackText}>Image unavailable</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      )}

      <Image
        source={{ uri }}
        style={styles.image}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setHasError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  loader: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },

  fallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
  },

  fallbackText: {
    fontSize: 12,
    textAlign: "center",
    padding: 6,
  },
});
