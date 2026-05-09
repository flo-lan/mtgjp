import React from "react";
import { View, StyleSheet, Text } from "react-native";

// Color mana backgrounds (circles)
import ManaWSym from "../../assets/mana-w-sym.svg";
import ManaUSym from "../../assets/mana-u-sym.svg";
import ManaGeneric from "../../assets/mana-generic.svg";
import ManaRSym from "../../assets/mana-r-sym.svg";
import ManaGSym from "../../assets/mana-g-sym.svg";
import ManaCSym from "../../assets/mana-c.svg";
import ManaESym from "../../assets/mana-e.svg";
import ManaSBg from "../../assets/mana-s-bg.svg";
import ManaSInner from "../../assets/mana-s-inner.svg";
import Mana10 from "../../assets/mana-10.svg";

// Color mana vectors (inner symbols)
import VectorWSym from "../../assets/vector-w-sym.svg";
import VectorUSym from "../../assets/vector-u-sym.svg";
import VectorBSym from "../../assets/vector-b-sym.svg";
import VectorRSym from "../../assets/vector-r-sym.svg";
import VectorGSym from "../../assets/vector-g-sym.svg";
import VectorCSym from "../../assets/vector-c.svg";
import VectorTSym from "../../assets/vector-t.svg";
import VectorXSym from "../../assets/vector-x.svg";

// Number vectors (0-9)
import Vector0 from "../../assets/vector-0.svg";
import Vector1 from "../../assets/vector-1-new.svg";
import Vector2 from "../../assets/vector-2.svg";
import Vector3 from "../../assets/vector-3.svg";
import Vector4 from "../../assets/vector-4.svg";
import Vector5 from "../../assets/vector-5.svg";
import Vector6 from "../../assets/vector-6.svg";
import Vector7 from "../../assets/vector-7.svg";
import Vector8 from "../../assets/vector-8.svg";


// Numbers 11-20
import Vector11 from "../../assets/vector-11.svg";
import Vector12 from "../../assets/vector-12.svg";
import Vector13 from "../../assets/vector-13.svg";
import Vector14 from "../../assets/vector-14.svg";
import Vector15 from "../../assets/vector-15.svg";
import Vector16 from "../../assets/vector-16.svg";
import Vector17 from "../../assets/vector-17.svg";
import Vector18 from "../../assets/vector-18.svg";
import Vector19 from "../../assets/vector-19.svg";
import Vector20 from "../../assets/vector-20.svg";

// Hybrid mana backgrounds
import HybridWuBg from "../../assets/hybrid-wu-bg.svg";
import HybridUbBg from "../../assets/hybrid-ub-bg.svg";
import HybridRwBg from "../../assets/hybrid-rw-bg.svg";
import HybridUrBg from "../../assets/hybrid-ur-bg.svg";
import HybridGwBg from "../../assets/hybrid-gw-bg.svg";
import HybridBrBg from "../../assets/hybrid-br-bg.svg";

// Hybrid mana group overlays
import HybridGroupWu from "../../assets/hybrid-group-wu.svg";
import HybridGroupWb from "../../assets/hybrid-group-wb.svg";
import HybridGroupUb from "../../assets/hybrid-group-ub.svg";
import HybridGroupRw from "../../assets/hybrid-group-rw.svg";
import HybridGroupRg from "../../assets/hybrid-group-rg.svg";
import HybridGroupUr from "../../assets/hybrid-group-ur.svg";
import HybridGroupGw from "../../assets/hybrid-group-gw.svg";
import HybridGroupGu from "../../assets/hybrid-group-gu.svg";
import HybridGroupBr from "../../assets/hybrid-group-br.svg";
import HybridGroupBg from "../../assets/hybrid-group-bg.svg";

// Phyrexian mana
import PhyWp from "../../assets/phy-wp.svg";
import PhyUp from "../../assets/phy-up.svg";
import PhyBp from "../../assets/phy-bp.svg";
import PhyRp from "../../assets/phy-rp.svg";
import PhyGp from "../../assets/phy-gp.svg";
import PhyVector from "../../assets/phy-vector.svg";
import PhyVectorGp from "../../assets/phy-vector-gp.svg";
import PhyVectorBp from "../../assets/phy-vector-bp.svg";

// ---- Symbol data maps ----

const COLOR_MANA: Record<string, any> = {
  W: {
    Bg: ManaWSym,
    Vector: VectorWSym,
    inset: ["2.07%", "2.35%", "2.05%", "2.27%"],
  },
  U: {
    Bg: ManaUSym,
    Vector: VectorUSym,
    inset: ["10.54%", "24.55%", "8.97%", "25.34%"],
  },
  B: {
    Bg: ManaGeneric,
    Vector: VectorBSym,
    inset: ["7.77%", "9.33%", "7.75%", "9.25%"],
  },
  R: {
    Bg: ManaRSym,
    Vector: VectorRSym,
    inset: ["6.78%", "16.23%", "7.38%", "6.65%"],
  },
  G: {
    Bg: ManaGSym,
    Vector: VectorGSym,
    inset: ["6.4%", "6.45%", "4.78%", "6.22%"],
  },
  C: { Bg: ManaCSym, Vector: VectorCSym, inset: ["10%", "10%", "10%", "10%"] },
};

// Assets are zero-indexed: vector-0.svg shows "1", …, vector-8.svg shows "9", vector-9.svg shows "10"
// No dedicated asset for {0} — falls through to the text fallback below
const NUMBER_VECTORS: Record<string, any> = {
  "1": { Vector: Vector0, inset: ["10.83%", "23.5%", "11.17%", "23%"] },
  "2": { Vector: Vector1, inset: ["8.67%", "32.17%", "12.83%", "31.5%"] },
  "3": { Vector: Vector2, inset: ["10.78%", "25.83%", "13%", "20.5%"] },
  "4": { Vector: Vector3, inset: ["10.45%", "26.17%", "11.33%", "21%"] },
  "5": { Vector: Vector4, inset: ["10.5%", "18.67%", "12.83%", "25.5%"] },
  "6": { Vector: Vector5, inset: ["10.67%", "25.17%", "11.33%", "24.83%"] },
  "7": { Vector: Vector6, inset: ["10.83%", "24.67%", "11.17%", "24.17%"] },
  "8": { Vector: Vector7, inset: ["10.5%", "24.17%", "12.67%", "24.17%"] },
  "9": { Vector: Vector8, inset: ["10.5%", "24.5%", "11.17%", "24.33%"] },
};

const LARGE_NUMBER_VECTORS: Record<string, any> = {
  "11": { Vector: Vector11, inset: ["18.32%", "21.57%", "18.32%", "18.9%"] },
  "12": { Vector: Vector12, inset: ["19.22%", "18%", "19.21%", "13.41%"] },
  "13": { Vector: Vector13, inset: ["19.79%", "20.6%", "19.79%", "12.6%"] },
  "14": { Vector: Vector14, inset: ["19.47%", "18.68%", "19.47%", "11.45%"] },
  "15": { Vector: Vector15, inset: ["18.13%", "16.41%", "18.13%", "15.63%"] },
  "16": { Vector: Vector16, inset: ["18.32%", "16.04%", "18.32%", "14.72%"] },
  "17": { Vector: Vector17, inset: ["19.02%", "15.96%", "19.02%", "15.96%"] },
  "18": { Vector: Vector18, inset: ["18.96%", "18.22%", "18.96%", "14.33%"] },
  "19": { Vector: Vector19, inset: ["18.58%", "19.15%", "18.57%", "12.38%"] },
  "20": { Vector: Vector20, inset: ["17.54%", "11.98%", "21.53%", "6.14%"] },
};

const HYBRID_MANA: Record<string, any> = {
  "W/U": {
    Bg: HybridWuBg,
    Group: HybridGroupWu,
    inset: ["10.57%", "14.65%", "0%", "0%"],
  },
  "W/B": {
    Bg: HybridWuBg,
    Group: HybridGroupWb,
    inset: ["10.55%", "14.65%", "0%", "0%"],
  },
  "U/B": {
    Bg: HybridUbBg,
    Group: HybridGroupUb,
    inset: ["7%", "14.64%", "0%", "0.01%"],
  },
  "U/R": {
    Bg: HybridUrBg,
    Group: HybridGroupUr,
    inset: ["6.99%", "14.66%", "-0.01%", "-0.01%"],
  },
  "B/R": {
    Bg: HybridBrBg,
    Group: HybridGroupBr,
    inset: ["8.07%", "13.4%", "0%", "0%"],
  },
  "B/G": {
    Bg: HybridBrBg,
    Group: HybridGroupBg,
    inset: ["8.07%", "13.41%", "0%", "0%"],
  },
  "R/W": {
    Bg: HybridRwBg,
    Group: HybridGroupRw,
    inset: ["10.52%", "14.65%", "-0.01%", "0%"],
  },
  "R/G": {
    Bg: HybridRwBg,
    Group: HybridGroupRg,
    inset: ["10.52%", "14.66%", "-0.01%", "-0.01%"],
  },
  "G/W": {
    Bg: HybridGwBg,
    Group: HybridGroupGw,
    inset: ["11.64%", "12.02%", "-0.01%", "0%"],
  },
  "G/U": {
    Bg: HybridGwBg,
    Group: HybridGroupGu,
    inset: ["11.6%", "12.02%", "0%", "0%"],
  },
};

const PHYREXIAN_MANA: Record<string, any> = {
  "W/P": {
    Bg: PhyWp,
    Vector: PhyVector,
    inset: ["0.98%", "22.25%", "1%", "22.25%"],
  },
  "U/P": {
    Bg: PhyUp,
    Vector: PhyVector,
    inset: ["0.98%", "22.25%", "1%", "22.25%"],
  },
  "B/P": {
    Bg: PhyBp,
    Vector: PhyVectorBp,
    inset: ["1%", "22.25%", "0.98%", "22.25%"],
  },
  "R/P": {
    Bg: PhyRp,
    Vector: PhyVector,
    inset: ["0.98%", "22.25%", "1%", "22.25%"],
  },
  "G/P": {
    Bg: PhyGp,
    Vector: PhyVectorGp,
    inset: ["0.98%", "22.25%", "1%", "22.27%"],
  },
};

interface ManaSymbolProps {
  symbol: string;
  size?: number;
  margin?: number;
}

export default function ManaSymbol({
  symbol,
  size = 16,
  margin = 0,
}: ManaSymbolProps) {
  console.log(symbol);
  const s = symbol.toUpperCase().replace(/[{}]/g, ""); // strip braces if present
  const sizeStyle = { width: size, height: size, marginBottom: margin };
  const renderIcon = (BgComp: any, VectorComp: any, inset: string[]) => (
    <View style={[styles.manaSymbol, sizeStyle]}>
      <BgComp width="100%" height="100%" />
      {VectorComp && (
        <View
          style={[
            styles.manaSymbolVector,
            {
              top: inset[0],
              right: inset[1],
              bottom: inset[2],
              left: inset[3],
            },
          ]}
        >
          <VectorComp width="100%" height="100%" />
        </View>
      )}
    </View>
  );

  if (PHYREXIAN_MANA[s]) {
    const { Bg, Vector, inset } = PHYREXIAN_MANA[s];
    return renderIcon(Bg, Vector, inset);
  }

  if (HYBRID_MANA[s]) {
    const { Bg, Group, inset } = HYBRID_MANA[s];
    return renderIcon(Bg, Group, inset);
  }

  if (COLOR_MANA[s]) {
    const { Bg, Vector, inset } = COLOR_MANA[s];
    return renderIcon(Bg, Vector, inset);
  }

  if (s === "T") {
    return renderIcon(ManaGeneric, VectorTSym, [
      "25.43%",
      "22.35%",
      "8.9%",
      "14.63%",
    ]);
  }

  if (s === "S") {
    return (
      <View style={[styles.manaSymbol, sizeStyle]}>
        <ManaSBg width="100%" height="100%" />
        <View style={StyleSheet.absoluteFill}>
          <ManaSInner width="100%" height="100%" />
        </View>
      </View>
    );
  }

  if (s === "E") {
    return (
      <View style={[styles.manaSymbol, sizeStyle]}>
        <ManaESym width="100%" height="100%" />
      </View>
    );
  }

  if (s === "X") {
    return (
      <View style={[styles.manaSymbol, sizeStyle]}>
        <VectorXSym width="100%" height="100%" />
      </View>
    );
  }

  if (s === "10") {
    return (
      <View style={[styles.manaSymbol, sizeStyle]}>
        <Mana10 width="100%" height="100%" />
      </View>
    );
  }

  if (LARGE_NUMBER_VECTORS[s]) {
    const { Vector, inset } = LARGE_NUMBER_VECTORS[s];
    return renderIcon(ManaSBg, Vector, inset);
  }

  const num = NUMBER_VECTORS[s];
  console.log(num);
  if (num) {
    return renderIcon(ManaGeneric, num.Vector, num.inset);
  }

  return (
    <View style={[styles.manaSymbol, sizeStyle]}>
      <ManaGeneric width="100%" height="100%" />
      <View style={styles.fallbackContainer}>
        <Text style={[styles.manaSymbolFallback, { fontSize: size * 0.5 }]}>
          {s}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  manaSymbol: {
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 1,
    elevation: 2,
    marginHorizontal: 1,
  },
  manaSymbolVector: {
    position: "absolute",
  },
  fallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  manaSymbolFallback: {
    fontWeight: "bold",
    color: "#000",
  },
});
