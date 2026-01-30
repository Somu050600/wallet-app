const { withProjectBuildGradle } = require("@expo/config-plugins");

const CONFIGURATIONS_BLOCK = `  configurations.all {
    resolutionStrategy.eachDependency { details ->
      if (details.requested.group == 'com.android.support' && details.requested.name == 'appcompat-v7') {
        details.useTarget 'androidx.appcompat:appcompat:1.6.1'
        details.because 'react-native-video transitive dep uses old support lib; use AndroidX'
      }
    }
  }
`;

const SUBPROJECTS_BLOCK = `
subprojects { subproject ->
  subproject.afterEvaluate {
    if (subproject.plugins.hasPlugin("org.jetbrains.kotlin.android")) {
      subproject.tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
          jvmTarget = "17"
        }
      }
    }
  }
}
`;

/**
 * Injects into root android/build.gradle:
 * 1. configurations.all resolutionStrategy (appcompat-v7 -> AndroidX) inside allprojects
 * 2. subprojects block to set Kotlin JVM target 17
 */
function withAndroidBuildGradle(config) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    if (typeof contents !== "string") return config;

    // Already applied
    if (
      contents.includes(
        "details.useTarget 'androidx.appcompat:appcompat:1.6.1'",
      )
    ) {
      return config;
    }

    // 1) Insert configurations.all inside allprojects (after repositories block, before allprojects closing })
    const allprojectsReposEnd =
      /(allprojects\s*\{\s*repositories\s*\{[\s\S]*?maven\s*\{\s*url\s*['"]https:\/\/www\.jitpack\.io['"]\s*\}\s*)\}\s*)(\})/;
    if (allprojectsReposEnd.test(contents)) {
      contents = contents.replace(
        allprojectsReposEnd,
        `$1${CONFIGURATIONS_BLOCK}$2`,
      );
    }

    // 2) Insert subprojects block before "apply plugin"
    if (!contents.includes('jvmTarget = "17"')) {
      const beforeApplyPlugin =
        /(\n)(apply plugin:\s*["']expo-root-project["'])/;
      contents = contents.replace(
        beforeApplyPlugin,
        `${SUBPROJECTS_BLOCK}$1$2`,
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAndroidBuildGradle;
