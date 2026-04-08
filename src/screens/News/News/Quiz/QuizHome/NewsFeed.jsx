import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

const NewsFeed = () => {
  // Données pour les catégories (Chips)
  const categories = ['Tout', 'Action', 'Romance', 'Shonen', 'Seinen', 'Aventure'];

  // Données pour le Trending (Cartes verticales)
  const trendingManga = [
    { id: '1', title: 'Blackline', image: 'url_image_1' },
    { id: '2', title: 'Les Héritiers', image: 'url_image_2' },
    { id: '3', title: 'Chimères', image: 'url_image_3' },
    { id: '4', title: 'Empire Teshiko', image: 'url_image_4' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 1. HERO CAROUSEL (Déjà existant ou à ajouter en haut) */}
      
      {/* 2. CATEGORY CHIPS */}
      <View style={styles.section}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipList}
        />
      </View>

      {/* 3. RANKING SECTION (Ton composant actuel) */}
      <RankingSection />

      {/* 4. TRENDING SECTION (Nouveau : Horizontal Portrait) */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>En Tendance</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trendingManga}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trendingCard}>
              <Image source={{ uri: item.image }} style={styles.trendingImage} />
              <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.trendingList}
        />
      </View>

      {/* 5. NEWS LIST (Vertical) */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  section: { marginVertical: 15 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15,
    marginBottom: 10 
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#8e44ad', fontSize: 14 },
  
  // Styles pour les Chips
  chipList: { paddingHorizontal: 10 },
  chip: { 
    backgroundColor: '#1a1a1a', 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333'
  },
  chipText: { color: '#fff', fontSize: 13 },

  // Styles pour Trending (Format Webtoon)
  trendingList: { paddingHorizontal: 10 },
  trendingCard: { width: 130, marginRight: 15 },
  trendingImage: { 
    width: 130, 
    height: 180, 
    borderRadius: 8, 
    backgroundColor: '#222' 
  },
  trendingTitle: { color: '#fff', marginTop: 5, fontSize: 14, fontWeight: '500' }
});

export default NewsFeed;
