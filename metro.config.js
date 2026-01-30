const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// GitHub install of react-native-shared-element has no build/ folder; resolve to src.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-shared-element") {
    return {
      filePath: path.join(
        __dirname,
        "node_modules",
        "react-native-shared-element",
        "src",
        "index.tsx",
      ),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
