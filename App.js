// App.js — Indian Handicrafts
// Advanced, polished React Native (Expo) app with favorites, search,
// category filters, grid layout, ratings, quantity selector, and more.

import React, { useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// ─── Color Palette ──────────────────────────────────────────────
const C = {
  primary:      '#4A3728',
  primaryLight: '#8D6E63',
  primaryFaded: '#D7CCC8',
  accent:       '#E8A838',
  accentLight:  '#FFF3E0',
  background:   '#F5F0EB',
  card:         '#FFFFFF',
  text:         '#2D2D2D',
  textSecondary:'#8A8A8A',
  white:        '#FFFFFF',
  black:        '#000000',
  border:       '#E8E2DC',
  whatsapp:     '#25D366',
  red:          '#E53935',
  star:         '#F5A623',
  overlay:      'rgba(0,0,0,0.45)',
  success:      '#43A047',
  tagBg:        '#EFEBE9',
};

// ─── Data ───────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Textiles', 'Woodwork', 'Jewelry', 'Bags', 'Metalwork', 'Basketry'];

const CRAFTS = [
  {
    id: '1', title: 'Rajasthani Turban', short: 'Traditional colorful Rajasthani pagri',
    price: 3500, image: require('./assets/gilgiticap.png'), rating: 4.8, reviews: 124, category: 'Textiles',
    description: "An iconic symbol of Rajasthan, this Pagri is handcrafted from pure, hand-spun cotton and silk. It is vibrant, lightweight, and features traditional Bandhani tie-dye patterns, elegantly adorned with a brooch pin and decorative tail.",
  },
  {
    id: '2', title: 'Pashmina Shawl', short: 'Luxurious hand-woven Kashmiri shawl',
    price: 5000, image: require('./assets/shawl.png'), rating: 4.9, reviews: 87, category: 'Textiles',
    description: "Experience timeless elegance with this hand-woven Pashmina shawl. Made from fine Kashmiri wool, it features traditional Kani weave patterns with rich paisley motifs in deep jewel tones, finished with a delicate hand-twisted fringe.",
  },
  {
    id: '3', title: 'Carved Wooden Pottery', short: 'Ornate hand-carved wooden pot',
    price: 7000, image: require('./assets/pottery.png'), rating: 4.7, reviews: 56, category: 'Woodwork',
    description: "A masterpiece of Indian woodcarving, this decorative pot is skillfully chiseled from durable Sheesham wood. The intricate Jali and floral patterns are a testament to the artisan's patience and lifelong dedication to their craft.",
  },
  {
    id: '4', title: 'Kundan & Silver Jewelry', short: 'Traditional Rajasthani jewelry set',
    price: 12000, image: require('./assets/silverjewelry.png'), rating: 4.9, reviews: 203, category: 'Jewelry',
    description: "This stunning, handcrafted Kundan jewelry set embodies the royal spirit of Rajasthan. It features intricate Meenakari enamel work with polished turquoise and ruby stones, adorned with dangling silver beads for a classic, regal look.",
  },
  {
    id: '5', title: 'Hand-Woven Cane Baskets', short: 'Durable handmade cane baskets',
    price: 1800, image: require('./assets/wickerbasket.png'), rating: 4.5, reviews: 42, category: 'Basketry',
    description: "Hand-woven by village artisans from Assam and Northeast India using traditional techniques, these cane and bamboo baskets are both beautiful and durable. Their robust, rustic design is perfect for household storage, as a planter, or for market day.",
  },
  {
    id: '6', title: 'Embroidered Wallet', short: 'Hand-embroidered blue pattern wallet',
    price: 2200, image: require('./assets/woodbag.png'), rating: 4.6, reviews: 68, category: 'Bags',
    description: "A blend of tradition and modern function. This durable wallet is covered in meticulous hand-embroidery, known as Kutchi mirror-work stitching. The striking blue and beige geometric patterns are a hallmark of Gujarat's craft heritage.",
  },
  {
    id: '7', title: 'Jute Handbag', short: 'Eco-friendly jute bag with strap',
    price: 2000, image: require('./assets/handbag.png'), rating: 4.4, reviews: 35, category: 'Bags',
    description: "Both eco-friendly and stylish, this versatile handbag is crafted from natural, resilient jute. It features a colorful, hand-woven central stripe and a comfortable, wide shoulder strap, making it the perfect everyday accessory.",
  },
  {
    id: '8', title: 'Brass Chai Kettle', short: 'Engraved brass tea kettle',
    price: 9500, image: require('./assets/samwar.png'), rating: 4.8, reviews: 91, category: 'Metalwork',
    description: "A centerpiece of Indian hospitality, this traditional brass chai kettle is used for brewing and serving hot tea. It is artfully engraved with detailed floral patterns, showcasing the timeless metalworking skills of Moradabad, Uttar Pradesh.",
  },
];

const ARTISANS = [
  {
    id: 'a1', name: 'Lakshmi Devi', craft: 'Shawl Weaving', town: 'Jaipur',
    experience: 30, products: 14,
    bio: "A master weaver from a long line of Jaipur artisans, Lakshmi Devi has been weaving for over 30 years. She specializes in natural dyes and intricate Bandhani patterns, passing her invaluable skills to the younger generation.",
  },
  {
    id: 'a2', name: 'Ravi Sharma', craft: 'Wood Carving', town: 'Jodhpur',
    experience: 25, products: 22,
    bio: "Ravi Sharma is a celebrated woodcarver from Jodhpur, known for his ability to bring Sheesham wood to life. His work, which includes ornate bowls, doors, and furniture, is inspired by the natural beauty of the Aravalli hills.",
  },
  {
    id: 'a3', name: 'Priya Patel', craft: 'Embroidery', town: 'Kutch',
    experience: 18, products: 31,
    bio: "From the vibrant region of Kutch, Gujarat, Priya Patel leads a women's cooperative focused on fine hand-embroidery. Her delicate Kutchi mirror-work and Aari stitchwork is highly sought after and helps provide a sustainable livelihood for many women in her community.",
  },
];

const NAV_ITEMS = [
  { name: 'Home',      icon: 'home' },
  { name: 'Crafts',    icon: 'grid' },
  { name: 'Favorites', icon: 'heart' },
  { name: 'Artisans',  icon: 'users' },
  { name: 'More',      icon: 'menu' },
];

// ─── Helpers ────────────────────────────────────────────────────
const fmt = (n) => `PKR ${n.toLocaleString()}`;

function Stars({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[...Array(full)].map((_, i) => (
        <Feather key={`f${i}`} name="star" size={size} color={C.star} style={{ marginRight: 1 }} />
      ))}
      {half && <Feather name="star" size={size} color={C.primaryFaded} style={{ marginRight: 1 }} />}
      <Text style={{ fontSize: size - 1, color: C.textSecondary, marginLeft: 4 }}>{rating}</Text>
    </View>
  );
}

function catIcon(cat) {
  const map = { Textiles: 'scissors', Woodwork: 'box', Jewelry: 'award', Bags: 'shopping-bag', Metalwork: 'tool', Basketry: 'package' };
  return map[cat] || 'tag';
}

// ─── Sub-components ─────────────────────────────────────────────

function SectionHeader({ title, action, onAction }) {
  return (
    <View style={st.sectionHeader}>
      <Text style={st.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}><Text style={st.sectionAction}>{action}</Text></TouchableOpacity>
      )}
    </View>
  );
}

function FeaturedCard({ item, onPress, isFav, toggleFav }) {
  return (
    <Pressable onPress={onPress} style={[st.featCard, st.shadow]}>
      <View style={{ position: 'relative' }}>
        <Image source={item.image} style={st.featImg} />
        <TouchableOpacity style={st.featHeart} onPress={toggleFav}>
          <Feather name="heart" size={18} color={isFav ? C.red : C.white} />
        </TouchableOpacity>
        <View style={st.featPriceBadge}><Text style={st.featPriceText}>{fmt(item.price)}</Text></View>
      </View>
      <View style={st.featBody}>
        <Text style={st.featTitle} numberOfLines={1}>{item.title}</Text>
        <Stars rating={item.rating} size={12} />
      </View>
    </Pressable>
  );
}

function GridCard({ item, onPress, isFav, toggleFav }) {
  return (
    <Pressable onPress={onPress} style={[st.gridCard, st.shadow]}>
      <View style={{ position: 'relative' }}>
        <Image source={item.image} style={st.gridImg} />
        <TouchableOpacity style={st.gridHeart} onPress={toggleFav}>
          <Feather name="heart" size={16} color={isFav ? C.red : C.white} />
        </TouchableOpacity>
      </View>
      <View style={st.gridBody}>
        <Text style={st.gridTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={st.gridSub} numberOfLines={1}>{item.short}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <Text style={st.gridPrice}>{fmt(item.price)}</Text>
          <Stars rating={item.rating} size={11} />
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState({ icon, message }) {
  return (
    <View style={st.empty}>
      <Feather name={icon} size={48} color={C.primaryFaded} />
      <Text style={st.emptyText}>{message}</Text>
    </View>
  );
}

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState('Home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [moreScreen, setMoreScreen] = useState(null);

  const toggleFav = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFav = useCallback((id) => favorites.includes(id), [favorites]);

  const openProduct = useCallback((item) => {
    setSelectedProduct(item);
    setQuantity(1);
    setModalVisible(true);
  }, []);

  const filteredCrafts = useMemo(() => {
    let list = CRAFTS;
    if (selectedCategory !== 'All') list = list.filter((c) => c.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.short.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const favCrafts = useMemo(() => CRAFTS.filter((c) => favorites.includes(c.id)), [favorites]);

  // ── Linking ─────────────────────────────────────────────────
  async function openLink(url, msg) {
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) await Linking.openURL(url);
      else Alert.alert('Error', msg);
    } catch { Alert.alert('Error', msg); }
  }

  function openWhatsApp(name, qty = 1) {
    const msg = `Hello, I'd like to order ${qty}x "${name}" from Indian Handicrafts.`;
    openLink(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, 'Make sure WhatsApp is installed.');
  }

  function openEmail() {
    openLink(
      `mailto:khanatayashraf@gmail.com?subject=${encodeURIComponent('Inquiry: Indian Handicrafts')}&body=${encodeURIComponent('Hello,\n\nI would like more information about...')}`,
      'Could not open email app.'
    );
  }

  // ── Screens ─────────────────────────────────────────────────
  const renderScreen = () => {
    if (screen === 'More' && moreScreen) {
      if (moreScreen === 'About') return renderAbout();
      if (moreScreen === 'Contact') return renderContact();
    }
    switch (screen) {
      case 'Home':      return renderHome();
      case 'Crafts':    return renderCrafts();
      case 'Favorites': return renderFavorites();
      case 'Artisans':  return renderArtisans();
      case 'More':      return renderMore();
      default:          return null;
    }
  };

  // ── HOME ────────────────────────────────────────────────────
  const renderHome = () => (
    <ScrollView contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
      <View style={st.hero}>
        <View style={st.heroOverlay}>
          <Text style={st.heroTag}>HANDCRAFTED WITH LOVE</Text>
          <Text style={st.heroTitle}>Keep Indian{'\n'}Craft Alive</Text>
          <Text style={st.heroSub}>Authentic, handmade treasures from the heart of India</Text>
          <TouchableOpacity style={st.heroCta} onPress={() => setScreen('Crafts')}>
            <Text style={st.heroCtaText}>Shop Collection</Text>
            <Feather name="arrow-right" size={18} color={C.primary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={st.statsRow}>
        {[{ n: '200+', l: 'Products' }, { n: '50+', l: 'Artisans' }, { n: '30+', l: 'Villages' }, { n: '4.8', l: 'Rating' }].map((s, i) => (
          <View key={i} style={st.statBox}>
            <Text style={st.statNum}>{s.n}</Text>
            <Text style={st.statLabel}>{s.l}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Featured Crafts" action="See All" onAction={() => setScreen('Crafts')} />
      <FlatList
        data={CRAFTS.slice(0, 5)}
        horizontal
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <FeaturedCard item={item} onPress={() => openProduct(item)} isFav={isFav(item.id)} toggleFav={() => toggleFav(item.id)} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      <SectionHeader title="Categories" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        {CATEGORIES.filter(c => c !== 'All').map((cat) => (
          <TouchableOpacity key={cat} style={st.catChip} onPress={() => { setSelectedCategory(cat); setScreen('Crafts'); }}>
            <Feather name={catIcon(cat)} size={20} color={C.primary} />
            <Text style={st.catChipText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader title="Master Artisans" action="View All" onAction={() => setScreen('Artisans')} />
      {ARTISANS.map((a) => (
        <View key={a.id} style={[st.artisanCard, st.shadow]}>
          <View style={st.artisanAvatar}><Text style={st.artisanAvatarText}>{a.name[0]}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={st.artisanName}>{a.name}</Text>
            <Text style={st.artisanMeta}>{a.craft} · {a.town}</Text>
          </View>
          <View style={st.artisanBadge}><Text style={st.artisanBadgeText}>{a.products} items</Text></View>
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  // ── CRAFTS ──────────────────────────────────────────────────
  const renderCrafts = () => (
    <View style={{ flex: 1 }}>
      <View style={st.searchWrap}>
        <Feather name="search" size={18} color={C.textSecondary} />
        <TextInput
          placeholder="Search crafts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={st.searchInput}
          placeholderTextColor={C.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}><Feather name="x" size={18} color={C.textSecondary} /></TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[st.filterChip, selectedCategory === cat && st.filterChipActive]}>
            <Text style={[st.filterChipText, selectedCategory === cat && st.filterChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 6 }}>
        <Text style={{ fontSize: 13, color: C.textSecondary }}>{filteredCrafts.length} product{filteredCrafts.length !== 1 ? 's' : ''} found</Text>
      </View>

      <FlatList
        data={filteredCrafts}
        numColumns={2}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <GridCard item={item} onPress={() => openProduct(item)} isFav={isFav(item.id)} toggleFav={() => toggleFav(item.id)} />}
        ListEmptyComponent={<EmptyState icon="search" message="No crafts match your search" />}
      />
    </View>
  );

  // ── FAVORITES ───────────────────────────────────────────────
  const renderFavorites = () => (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <Text style={st.screenTitle}>My Favorites</Text>
        <Text style={{ fontSize: 13, color: C.textSecondary, marginBottom: 10 }}>{favCrafts.length} saved item{favCrafts.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={favCrafts}
        numColumns={2}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <GridCard item={item} onPress={() => openProduct(item)} isFav={true} toggleFav={() => toggleFav(item.id)} />}
        ListEmptyComponent={<EmptyState icon="heart" message="Tap the heart icon on any product to save it here" />}
      />
    </View>
  );

  // ── ARTISANS ────────────────────────────────────────────────
  const renderArtisans = () => (
    <ScrollView contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
      <Text style={[st.screenTitle, { marginHorizontal: 20, marginTop: 12 }]}>Artisan Profiles</Text>
      {ARTISANS.map((a) => (
        <View key={a.id} style={[st.artisanProfileCard, st.shadow]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <View style={st.artisanAvatarLg}><Text style={st.artisanAvatarTextLg}>{a.name[0]}{a.name.split(' ')[1]?.[0] || ''}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={st.artisanNameLg}>{a.name}</Text>
              <Text style={st.artisanMeta}>{a.craft} · {a.town}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View style={st.artisanStat}><Text style={st.artisanStatNum}>{a.experience}</Text><Text style={st.artisanStatLabel}>Years</Text></View>
                <View style={[st.artisanStat, { marginLeft: 16 }]}><Text style={st.artisanStatNum}>{a.products}</Text><Text style={st.artisanStatLabel}>Products</Text></View>
              </View>
            </View>
          </View>
          <Text style={st.artisanBio}>{a.bio}</Text>
          <TouchableOpacity style={st.artisanContactBtn} onPress={() => openLink(`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'd like to connect with artisan ${a.name}.`)}`, 'Could not open WhatsApp.')}>
            <Feather name="message-circle" size={16} color={C.white} />
            <Text style={st.artisanContactBtnText}>Connect</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  // ── MORE ────────────────────────────────────────────────────
  const renderMore = () => (
    <ScrollView contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
      <Text style={[st.screenTitle, { marginHorizontal: 20, marginTop: 12 }]}>More</Text>
      {[
        { label: 'About Us', icon: 'info', key: 'About' },
        { label: 'Contact & Partnership', icon: 'mail', key: 'Contact' },
        { label: 'Rate This App', icon: 'star', key: 'rate' },
        { label: 'Share App', icon: 'share-2', key: 'share' },
      ].map((item) => (
        <TouchableOpacity key={item.key} style={[st.moreRow, st.shadow]} onPress={() => {
          if (item.key === 'About' || item.key === 'Contact') setMoreScreen(item.key);
          else Alert.alert(item.label, 'This feature is coming soon!');
        }}>
          <View style={st.moreIcon}><Feather name={item.icon} size={20} color={C.primary} /></View>
          <Text style={st.moreLabel}>{item.label}</Text>
          <Feather name="chevron-right" size={20} color={C.textSecondary} />
        </TouchableOpacity>
      ))}
      <Text style={{ textAlign: 'center', color: C.textSecondary, fontSize: 12, marginTop: 30 }}>Indian Handicrafts v1.0.0</Text>
    </ScrollView>
  );

  // ── ABOUT ───────────────────────────────────────────────────
  const renderAbout = () => (
    <ScrollView contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => setMoreScreen(null)} style={st.backBtn}>
        <Feather name="arrow-left" size={20} color={C.primary} /><Text style={st.backBtnText}>Back</Text>
      </TouchableOpacity>
      <View style={[st.aboutCard, st.shadow]}>
        <Text style={st.aboutTitle}>Our Mission & Heritage</Text>
        <Text style={st.aboutText}>
          Indian Handicrafts is more than a marketplace; it is a cultural preservation project. Our mission is to connect the world with the rich artistic heritage of India, ensuring that these timeless skills are passed down to future generations.
        </Text>
        <View style={st.aboutDivider} />
        <Text style={st.aboutSubTitle}>Empowering Artisans</Text>
        <Text style={st.aboutText}>
          We work directly with master artisans, cooperatives, and families across the country — from Rajasthan to Gujarat, Kashmir to Assam. By providing fair market access and a global platform, we help create sustainable livelihoods, empower local communities (especially women), and ensure artisans are rightfully compensated.
        </Text>
        <View style={st.aboutDivider} />
        <Text style={st.aboutSubTitle}>Authentic Craftsmanship</Text>
        <Text style={st.aboutText}>
          Every item in our collection is 100% handmade, carrying a story of its own. From the wool sheared in the Himalayas to the natural dyes harvested from the land, our products are a direct link to the people and traditions of India.
        </Text>
      </View>
      <View style={st.impactRow}>
        {[{ n: '500+', l: 'Artisans Supported' }, { n: '30+', l: 'Villages Reached' }, { n: '10K+', l: 'Products Sold' }].map((s, i) => (
          <View key={i} style={[st.impactBox, st.shadow]}>
            <Text style={st.impactNum}>{s.n}</Text>
            <Text style={st.impactLabel}>{s.l}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // ── CONTACT ─────────────────────────────────────────────────
  const renderContact = () => (
    <ScrollView contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => setMoreScreen(null)} style={st.backBtn}>
        <Feather name="arrow-left" size={20} color={C.primary} /><Text style={st.backBtnText}>Back</Text>
      </TouchableOpacity>
      <View style={[st.contactCard, st.shadow]}>
        <Text style={st.aboutTitle}>Get in Touch</Text>
        <Text style={[st.aboutText, { marginBottom: 16 }]}>Have a question, want to place a bulk order, or interested in a partnership? We'd love to hear from you.</Text>
        <TextInput placeholder="Full Name" value={contact.name} onChangeText={(t) => setContact((p) => ({ ...p, name: t }))} style={st.input} placeholderTextColor={C.textSecondary} />
        <TextInput placeholder="Email Address" value={contact.email} onChangeText={(t) => setContact((p) => ({ ...p, email: t }))} style={st.input} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={C.textSecondary} />
        <TextInput placeholder="Your Message" value={contact.message} onChangeText={(t) => setContact((p) => ({ ...p, message: t }))} style={[st.input, { height: 110, textAlignVertical: 'top' }]} multiline placeholderTextColor={C.textSecondary} />
        <TouchableOpacity style={st.sendBtn} onPress={() => { Alert.alert('Thank you!', 'Your message has been sent.'); setContact({ name: '', email: '', message: '' }); }}>
          <Feather name="send" size={18} color={C.white} style={{ marginRight: 8 }} />
          <Text style={st.sendBtnText}>Send Message</Text>
        </TouchableOpacity>
      </View>
      <View style={[st.contactCard, st.shadow, { marginTop: 16 }]}>
        <Text style={st.aboutSubTitle}>Other Ways to Reach Us</Text>
        {[
          { icon: 'mail', label: 'khanatayashraf@gmail.com', act: openEmail },
          { icon: 'phone', label: '+91 98765 43210', act: () => openLink('tel:+919876543210', 'Cannot open dialer.') },
          { icon: 'map-pin', label: 'Jaipur, Rajasthan, India', act: null },
        ].map((c, i) => (
          <TouchableOpacity key={i} style={st.contactRow} onPress={c.act} disabled={!c.act}>
            <View style={st.contactIconWrap}><Feather name={c.icon} size={18} color={C.primary} /></View>
            <Text style={[st.contactRowText, c.act && { color: C.primary }]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // ── Header title ────────────────────────────────────────────
  const headerTitle = () => {
    if (screen === 'More' && moreScreen) return moreScreen === 'About' ? 'About Us' : 'Contact';
    return screen === 'Home' ? null : screen;
  };

  // ── RENDER ──────────────────────────────────────────────────
  const isWeb = Platform.OS === 'web';

  const appContent = (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />

      <View style={st.header}>
        {screen === 'Home' ? (
          <View>
            <Text style={st.headerGreeting}>Indian Handicrafts</Text>
            <Text style={st.headerSub}>Discover authentic artistry</Text>
          </View>
        ) : (
          <Text style={st.headerTitleText}>{headerTitle()}</Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {favorites.length > 0 && screen !== 'Favorites' && (
            <TouchableOpacity style={st.headerIconBtn} onPress={() => { setScreen('Favorites'); setMoreScreen(null); }}>
              <Feather name="heart" size={22} color={C.red} />
              <View style={st.badge}><Text style={st.badgeText}>{favorites.length}</Text></View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={st.content}>{renderScreen()}</View>

      <View style={st.nav}>
        {NAV_ITEMS.map((item) => {
          const active = screen === item.name;
          return (
            <TouchableOpacity key={item.name} onPress={() => { setScreen(item.name); setMoreScreen(null); }} style={st.navTab}>
              <View style={active ? st.navIndicator : null}>
                <Feather name={item.icon} size={22} color={active ? C.primary : C.textSecondary} />
              </View>
              <Text style={[st.navLabel, active && st.navLabelActive]}>{item.name}</Text>
              {item.name === 'Favorites' && favorites.length > 0 && (
                <View style={st.navBadge}><Text style={st.navBadgeText}>{favorites.length}</Text></View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent presentationStyle="overFullScreen" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={st.modalBackdrop} onPress={() => setModalVisible(false)} />
        <View style={st.modalWrap}>
          <View style={st.modalHandle} />
          {selectedProduct && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ position: 'relative' }}>
                <Image source={selectedProduct.image} style={st.modalImg} />
                <TouchableOpacity style={st.modalClose} onPress={() => setModalVisible(false)}>
                  <Feather name="x" size={22} color={C.text} />
                </TouchableOpacity>
                <TouchableOpacity style={st.modalFav} onPress={() => toggleFav(selectedProduct.id)}>
                  <Feather name="heart" size={20} color={isFav(selectedProduct.id) ? C.red : C.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={st.modalBody}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={st.modalTitle}>{selectedProduct.title}</Text>
                    <View style={st.modalTagRow}>
                      <View style={st.modalTag}><Text style={st.modalTagText}>{selectedProduct.category}</Text></View>
                      <Stars rating={selectedProduct.rating} size={14} />
                      <Text style={{ fontSize: 12, color: C.textSecondary, marginLeft: 4 }}>({selectedProduct.reviews})</Text>
                    </View>
                  </View>
                  <Text style={st.modalPrice}>{fmt(selectedProduct.price)}</Text>
                </View>

                <Text style={st.modalDesc}>{selectedProduct.description}</Text>

                <Text style={st.modalQtyLabel}>Quantity</Text>
                <View style={st.qtyRow}>
                  <TouchableOpacity style={st.qtyBtn} onPress={() => setQuantity((q) => Math.max(1, q - 1))}><Feather name="minus" size={18} color={C.text} /></TouchableOpacity>
                  <Text style={st.qtyNum}>{quantity}</Text>
                  <TouchableOpacity style={st.qtyBtn} onPress={() => setQuantity((q) => q + 1)}><Feather name="plus" size={18} color={C.text} /></TouchableOpacity>
                  <Text style={st.qtyTotal}>Total: {fmt(selectedProduct.price * quantity)}</Text>
                </View>

                <TouchableOpacity style={st.orderBtn} onPress={() => openWhatsApp(selectedProduct.title, quantity)}>
                  <Feather name="message-circle" size={20} color={C.white} style={{ marginRight: 8 }} />
                  <Text style={st.orderBtnText}>Order on WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity style={st.shareBtn} onPress={() => Alert.alert('Share', 'Sharing feature coming soon!')}>
                  <Feather name="share-2" size={18} color={C.primary} style={{ marginRight: 8 }} />
                  <Text style={st.shareBtnText}>Share This Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );

  if (isWeb) {
    return (
      <View style={st.webOuter}>
        <View style={st.webFrame}>{appContent}</View>
      </View>
    );
  }
  return appContent;
}

// ─── Styles ─────────────────────────────────────────────────────
const st = StyleSheet.create({
  // Web frame
  webOuter: { flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' },
  webFrame: { width: 430, maxWidth: '100%', height: '100%', maxHeight: 932, borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 12 },

  // Core
  container: { flex: 1, backgroundColor: C.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollPad: { paddingBottom: 90 },
  content: { flex: 1 },
  shadow: { shadowColor: C.black, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  headerGreeting: { fontSize: 20, fontWeight: '800', color: C.primary },
  headerSub: { fontSize: 13, color: C.textSecondary, marginTop: 2 },
  headerTitleText: { fontSize: 20, fontWeight: '700', color: C.text },
  headerIconBtn: { position: 'relative', padding: 6 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: C.red, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: C.white, fontSize: 10, fontWeight: '700' },

  // Nav
  nav: { flexDirection: 'row', height: Platform.OS === 'ios' ? 82 : 64, paddingBottom: Platform.OS === 'ios' ? 18 : 0, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 10 },
  navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  navIndicator: { backgroundColor: C.accentLight, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  navLabel: { fontSize: 10, color: C.textSecondary, marginTop: 2 },
  navLabelActive: { color: C.primary, fontWeight: '700' },
  navBadge: { position: 'absolute', top: 6, right: '22%', backgroundColor: C.red, borderRadius: 7, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
  navBadgeText: { color: C.white, fontSize: 9, fontWeight: '700' },

  // Hero
  hero: { margin: 16, borderRadius: 20, backgroundColor: C.primary, overflow: 'hidden' },
  heroOverlay: { padding: 28, alignItems: 'center' },
  heroTag: { fontSize: 11, fontWeight: '700', color: C.accent, letterSpacing: 2, marginBottom: 10 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: C.white, textAlign: 'center', lineHeight: 38 },
  heroSub: { fontSize: 14, color: C.primaryFaded, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  heroCta: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  heroCtaText: { fontSize: 15, fontWeight: '700', color: C.primary },

  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, backgroundColor: C.card, borderRadius: 14, padding: 14, shadowColor: C.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: C.primary },
  statLabel: { fontSize: 11, color: C.textSecondary, marginTop: 2 },

  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: C.text },
  sectionAction: { fontSize: 14, fontWeight: '600', color: C.accent },

  // Category chips
  catChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10, borderWidth: 1, borderColor: C.border },
  catChipText: { fontSize: 13, fontWeight: '600', color: C.text, marginLeft: 8 },

  // Featured card
  featCard: { width: 200, backgroundColor: C.card, borderRadius: 16, marginRight: 14, overflow: 'hidden' },
  featImg: { width: '100%', height: 140, resizeMode: 'cover' },
  featHeart: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 6 },
  featPriceBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  featPriceText: { color: C.white, fontSize: 12, fontWeight: '700' },
  featBody: { padding: 12 },
  featTitle: { fontWeight: '700', fontSize: 14, color: C.text, marginBottom: 4 },

  // Grid card
  gridCard: { width: '47%', backgroundColor: C.card, borderRadius: 14, marginBottom: 14, overflow: 'hidden' },
  gridImg: { width: '100%', height: 130, resizeMode: 'cover' },
  gridHeart: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: 5 },
  gridBody: { padding: 10 },
  gridTitle: { fontWeight: '700', fontSize: 13, color: C.text },
  gridSub: { fontSize: 11, color: C.textSecondary, marginTop: 2 },
  gridPrice: { fontWeight: '800', fontSize: 14, color: C.primary },

  // Filter chips
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, marginRight: 8, borderWidth: 1.5, borderColor: C.border },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterChipText: { fontSize: 13, fontWeight: '600', color: C.text },
  filterChipTextActive: { color: C.white },

  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, margin: 16, marginBottom: 10, borderRadius: 14, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 8, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: C.text },

  // Screen title
  screenTitle: { fontSize: 22, fontWeight: '800', color: C.text },

  // Artisan
  artisanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, marginHorizontal: 16, marginBottom: 10, padding: 14 },
  artisanAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  artisanAvatarText: { fontWeight: '700', color: C.white, fontSize: 16 },
  artisanName: { fontWeight: '700', fontSize: 15, color: C.text },
  artisanMeta: { color: C.textSecondary, fontSize: 13, marginTop: 2 },
  artisanBadge: { backgroundColor: C.accentLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  artisanBadgeText: { fontSize: 12, fontWeight: '600', color: C.accent },

  // Artisan profile card
  artisanProfileCard: { backgroundColor: C.card, borderRadius: 16, marginHorizontal: 16, marginBottom: 16, padding: 18 },
  artisanAvatarLg: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  artisanAvatarTextLg: { fontWeight: '800', color: C.white, fontSize: 20 },
  artisanNameLg: { fontWeight: '800', fontSize: 18, color: C.text },
  artisanStat: { alignItems: 'center' },
  artisanStatNum: { fontSize: 18, fontWeight: '800', color: C.primary },
  artisanStatLabel: { fontSize: 11, color: C.textSecondary },
  artisanBio: { fontSize: 14, lineHeight: 22, color: C.textSecondary },
  artisanContactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.whatsapp, borderRadius: 12, paddingVertical: 12, marginTop: 16 },
  artisanContactBtnText: { color: C.white, fontWeight: '700', fontSize: 15, marginLeft: 8 },

  // More menu
  moreRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, marginHorizontal: 16, marginBottom: 10, padding: 16 },
  moreIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  moreLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: C.text },

  // About
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backBtnText: { fontSize: 15, fontWeight: '600', color: C.primary, marginLeft: 6 },
  aboutCard: { backgroundColor: C.card, borderRadius: 16, marginHorizontal: 16, padding: 20 },
  aboutTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 12 },
  aboutSubTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 6 },
  aboutText: { fontSize: 14, lineHeight: 22, color: C.textSecondary },
  aboutDivider: { height: 1, backgroundColor: C.border, marginVertical: 16 },

  // Impact
  impactRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16 },
  impactBox: { flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 14, alignItems: 'center', marginHorizontal: 4 },
  impactNum: { fontSize: 22, fontWeight: '800', color: C.primary },
  impactLabel: { fontSize: 11, color: C.textSecondary, marginTop: 4, textAlign: 'center' },

  // Contact
  contactCard: { backgroundColor: C.card, borderRadius: 16, marginHorizontal: 16, padding: 20 },
  input: { backgroundColor: C.background, padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 15, borderColor: C.border, borderWidth: 1, color: C.text },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, marginTop: 4 },
  sendBtnText: { color: C.white, fontWeight: '700', fontSize: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  contactIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactRowText: { fontSize: 14, color: C.text, flex: 1 },

  // Empty state
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, color: C.textSecondary, marginTop: 14, textAlign: 'center', paddingHorizontal: 40 },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: C.overlay },
  modalWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '90%', backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: C.border, alignSelf: 'center', marginTop: 10, marginBottom: 6 },
  modalImg: { width: '100%', height: 260, resizeMode: 'cover' },
  modalClose: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: 6 },
  modalFav: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: 6 },
  modalBody: { padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: C.text },
  modalTagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 14 },
  modalTag: { backgroundColor: C.tagBg, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginRight: 10 },
  modalTagText: { fontSize: 12, fontWeight: '600', color: C.primary },
  modalPrice: { fontSize: 22, fontWeight: '800', color: C.accent },
  modalDesc: { fontSize: 14, lineHeight: 23, color: C.textSecondary, marginBottom: 18 },
  modalQtyLabel: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  qtyBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: 18, fontWeight: '700', color: C.text, marginHorizontal: 18 },
  qtyTotal: { fontSize: 14, fontWeight: '600', color: C.textSecondary, marginLeft: 'auto' },
  orderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.whatsapp, borderRadius: 14, paddingVertical: 15, marginBottom: 10 },
  orderBtnText: { color: C.white, fontWeight: '700', fontSize: 16 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.primary, borderRadius: 14, paddingVertical: 13 },
  shareBtnText: { fontSize: 15, fontWeight: '600', color: C.primary },
});