import * as React from "react";
import { View } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../Screens/HomeScreen";
import ExploreScreen from "../Screens/ExploreScreen";
import ScanScreen from "../Screens/ScanScreen";
import SavedScreen from "../Screens/SavedScreen";
import SettingsScreen from "../Screens/SettingsScreen";

export default function Navbar({ navigation, index, setIndex }) {
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "explore",
      title: "Explore",
      focusedIcon: "compass",
      unfocusedIcon: "compass-outline",
    },
    {
      key: "scan",
      title: "Scan",
      focusedIcon: "credit-card-scan",
      unfocusedIcon: "credit-card-scan-outline",
    },
    {
      key: "saved",
      title: "Saved",
      focusedIcon: "bookmark",
      unfocusedIcon: "bookmark-outline",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  // const HomeRoute = () => (
  //   <HomeScreen navigation={navigation} setIndex={setIndex} />
  // );

  // const ExploreRoute = () => (
  //   <ExploreScreen navigation={navigation} setIndex={setIndex} />
  // );

  // const ScanRoute = () => (
  //   <ScanScreen navigation={navigation} setIndex={setIndex} />
  // );

  // const SavedRoute = () => (
  //   <SavedScreen navigation={navigation} setIndex={setIndex} />
  // );

  // const SettingsRoute = () => (
  //   <SettingsScreen navigation={navigation} setIndex={setIndex} />
  // );

  // const renderScene = BottomNavigation.SceneMap({
  //   home: HomeRoute,
  //   explore: ExploreRoute,
  //   scan: ScanRoute,
  //   saved: SavedRoute,
  //   settings: SettingsRoute,
  // });

  const memoizedRoutes = React.useMemo(() => {
    return {
      home: () => <HomeScreen navigation={navigation} />,
      explore: () => <ExploreScreen navigation={navigation} />,
      scan: () => <ScanScreen navigation={navigation} />,
      saved: () => <SavedScreen navigation={navigation} />,
      settings: () => <SettingsScreen navigation={navigation} />,
    };
  }, [navigation, setIndex]);

  const renderScene = BottomNavigation.SceneMap(memoizedRoutes);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
