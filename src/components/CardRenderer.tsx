import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { CardData } from "../utils/scryfall";
import { DictEntry } from "../utils/dictionary";
import { InteractiveText } from "./InteractiveText";
import StandardCard from "./native-mtg-card/StandardCard";

interface Props {
  card: CardData;
  enCard?: CardData | null;
  onWordSelect: (entry: DictEntry) => void;
}

const CARD_MAX_WIDTH = 380;

export function CardRenderer({ card, enCard, onWordSelect }: Props) {
  const [showFurigana, setShowFurigana] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const manaCost =
    (card.mana_cost || "")
      .match(/\{([^}]+)\}/g)
      ?.map((s) => s.replace(/[{}]/g, "")) || [];
  const cardWidth = Math.min(
    Dimensions.get("window").width - 40,
    CARD_MAX_WIDTH,
  );
  const rulesText = card.printed_text || card.oracle_text || "";

  // Scale font size down as text gets longer; clamp between 13 and 20.
  const rulesTextFontSize = Math.max(13, Math.min(20, 20 - Math.floor(rulesText.length / 30)));

  const enImageHeight = cardWidth * 1.4;

  return (
    <View style={styles.container}>
      {/* ── Swipeable card pages ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!!enCard}
        style={{ width: cardWidth }}
        contentContainerStyle={{ width: cardWidth * (enCard ? 2 : 1) }}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
          setActivePage(page);
        }}
      >
        {/* Japanese card */}
        <View style={{ width: cardWidth, alignItems: "center" }}>
          <StandardCard
            width={cardWidth}
            cardName={card.printed_name || card.name}
            manaCost={manaCost}
            cardArt={card.image_uris?.art_crop}
            typeLine={card.printed_type_line || card.type_line}
            legendary={card.type_line.includes("Legendary")}
            rulesText={
              <InteractiveText
                text={rulesText}
                onWordSelect={onWordSelect}
                showFurigana={showFurigana}
                fontSize={rulesTextFontSize}
              />
            }
            power={card.power}
            toughness={card.toughness}
            cardNumber={card.collector_number}
            setCode={card.set}
            rarity={card.rarity}
            artist={card.artist}
          />
        </View>

        {/* English card image */}
        {enCard && (
          <View style={{ width: cardWidth, alignItems: "center" }}>
            {enCard.image_uris?.normal ? (
              <Image
                source={{ uri: enCard.image_uris.normal }}
                style={[
                  styles.enCardImage,
                  { width: cardWidth, height: enImageHeight },
                ]}
                resizeMode="contain"
              />
            ) : (
              <View
                style={[
                  styles.enCardPlaceholder,
                  { width: cardWidth, height: enImageHeight },
                ]}
              >
                <Text style={styles.enCardPlaceholderText}>
                  No English image available
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Page dots */}
      {enCard && (
        <View style={styles.dots}>
          <View style={[styles.dot, activePage === 0 && styles.dotActive]} />
          <View style={[styles.dot, activePage === 1 && styles.dotActive]} />
        </View>
      )}

      {/* Furigana toggle — only relevant on JA page */}
      {activePage === 0 && (
        <Pressable
          style={[
            styles.furiganaToggle,
            showFurigana && styles.furiganaToggleActive,
          ]}
          onPress={() => setShowFurigana((v: boolean) => !v)}
        >
          <Text
            style={[
              styles.furiganaToggleText,
              showFurigana && styles.furiganaToggleTextActive,
            ]}
          >
            ふりがな
          </Text>
        </Pressable>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  enCardImage: {
    borderRadius: 14,
  },
  enCardPlaceholder: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  enCardPlaceholderText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotActive: {
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  furiganaToggle: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: -4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  furiganaToggleActive: {
    borderColor: "rgba(198,147,32,0.5)",
    backgroundColor: "rgba(198,147,32,0.12)",
  },
  furiganaToggleText: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
  },
  furiganaToggleTextActive: {
    color: "#E8B630",
  },
});
