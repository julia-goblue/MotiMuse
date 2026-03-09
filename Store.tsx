import React, { useState } from "react";
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "./BottomNav";

export default function Store() {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<
      "home" | "music" | "box" | "profile"
    >("box");
  
    const handleTabPress = (tab: "home" | "music" | "box" | "profile") => {
      setActiveTab(tab);
      
    if (tab === "music") {
      navigation.navigate("Timer");
    }
    if (tab === "home") {
      navigation.navigate("Dashboard");
    }
    if (tab === "box") {
      navigation.navigate("Store");
    }
    };

  const st_colors = ["SUNSET", "OCEAN", "BUBBLEGUM", "EARTH"]; // hat color variants

  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const handleSelectHat = (hatId: string) => {setSelectedHat(hatId);};
  const [ownedHats, setOwnedHats] = useState<string[]>([]);
  const purchaseHat = (hatId: string) => {
    if (!ownedHats.includes(hatId)) {setOwnedHats(prev => [...prev, hatId]);}
  };
  //Image MainAvatar = require("./assets/motimuse.png");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Store</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text>💰 105</Text>
          </View>
          <View style={styles.statBox}>
            <Text>⭐ 9</Text>
          </View>
        </View>
      </View>

      {/* Big Avatar */}
      <View style={styles.avatarContainer}> {/*NEED TO GET AVATAR IMAGES*/}
        {(!selectedHat && <Image source={require("./assets/motimuse.png")} style={styles.big_img}/>)}
        {(selectedHat == "OB" && <Image source={require("./assets/OB_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "BB" && <Image source={require("./assets/BB_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "GB" && <Image source={require("./assets/GB_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "PB" && <Image source={require("./assets/PB_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "OG" && <Image source={require("./assets/OG_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "BG" && <Image source={require("./assets/BG_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "GG" && <Image source={require("./assets/GG_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "PG" && <Image source={require("./assets/PG_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "OC" && <Image source={require("./assets/OC_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "BC" && <Image source={require("./assets/BC_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "GC" && <Image source={require("./assets/GC_hat.png")} style={styles.big_img}/>)}
        {(selectedHat == "PC" && <Image source={require("./assets/PC_hat.png")} style={styles.big_img}/>)}
      </View>

      {/* Store Block */}
      <View style={styles.mainStore}>
        <View style={styles.storeRow}> {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("OB")}>
            <Image source={require("./assets/OB_hat.png")}
              style={[ styles.hat_img, selectedHat === "OB" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("BB")}>
            <Image source={require("./assets/BB_hat.png")}
              style={[ styles.hat_img, selectedHat === "BB" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("GB")}>
            <Image source={require("./assets/GB_hat.png")}
              style={[ styles.hat_img, selectedHat === "GB" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("PB")}>
            <Image source={require("./assets/PB_hat.png")}
              style={[ styles.hat_img, selectedHat === "PB" && styles.selected_hat ]} />
          </TouchableOpacity>
        </View>
        <View style={styles.storeRow}> {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("OG")}>
            <Image source={require("./assets/OG_hat.png")}
              style={[ styles.hat_img, selectedHat === "OG" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("BG")}>
            <Image source={require("./assets/BG_hat.png")}
              style={[ styles.hat_img, selectedHat === "BG" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("GG")}>
            <Image source={require("./assets/GG_hat.png")}
              style={[ styles.hat_img, selectedHat === "GG" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("PG")}>
            <Image source={require("./assets/PG_hat.png")}
              style={[ styles.hat_img, selectedHat === "PG" && styles.selected_hat ]} />
          </TouchableOpacity>
        </View>
        <View style={styles.storeRow}> {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("OC")}>
            <Image source={require("./assets/OC_hat.png")}
              style={[ styles.hat_img, selectedHat === "OC" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("BC")}>
            <Image source={require("./assets/BC_hat.png")}
              style={[ styles.hat_img, selectedHat === "BC" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("GC")}>
            <Image source={require("./assets/GC_hat.png")}
              style={[ styles.hat_img, selectedHat === "GC" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("PC")}>
            <Image source={require("./assets/PC_hat.png")}
              style={[ styles.hat_img, selectedHat === "PC" && styles.selected_hat ]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}> 
        {(selectedHat == "OB" ||selectedHat == "BB" || selectedHat == "GB" 
          ||selectedHat == "PB") && (<View style={styles.purchased}>
          <Text>💰 15</Text>
        </View>)}
        {(selectedHat == "OG" ||selectedHat == "BG" || selectedHat == "GG" 
          ||selectedHat == "PG") &&  (<View style={styles.purchased}>
          <Text>💰 25</Text>
        </View>)}
        {(selectedHat == "OC" ||selectedHat == "BC" || selectedHat == "GC" 
          ||selectedHat == "PC") &&  (<View style={styles.purchased}>
          <Text>💰 35</Text>
        </View>)}
        {selectedHat && !ownedHats.includes(selectedHat) && (
        <TouchableOpacity style={styles.purchase} onPress={() => purchaseHat(selectedHat)}>
          <Text style={styles.purchase_text}>Purchase</Text>
        </TouchableOpacity>)}
        {selectedHat && ownedHats.includes(selectedHat) && (
        <TouchableOpacity style={styles.purchased}>
          <Text>Select</Text>
        </TouchableOpacity>
        )}
      </View>


      {/* Shop Button or home bar */}
      {/* Bottom Nav */}
            <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
  },
  statBox: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    marginTop: 10,
  },
  barWrapper: {
    width: 20,
    alignItems: "center",
  },
  bar: {
    width: 18,
    backgroundColor: "#6EF2B2",
    borderRadius: 6,
  },
  avgText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
  practiceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  mainStore: {
    //backgroundColor: "#c3bfbf",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    gap: 7,
  },
  storeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
    gap: 5,
  },
  itemButton: {
    //backgroundColor: "#299564",
    alignItems: "center",
    margin: 0,
    width: 80,
    height: 80,
  },
  hat_img: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  selected_hat: { //when hats have transparent background and want selection shadow
    width: 90,
    height: 90,
    resizeMode: "contain",
    shadowColor: "#76b9d3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6, 
    elevation: 8, //added for Android
  },
  big_img: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  purchase: {
    backgroundColor: "#299564",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
    color: "white",
    width: 175,
    height: 40,
    //display: "none",
  },
  purchase_text: {
    color: "white",
  },
  purchased: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    margin: 8,
    width: 175,
    height: 40,
    //display: "none",
  },
  buttonRow: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
  },
});

