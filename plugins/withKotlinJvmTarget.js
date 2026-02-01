const { withProjectBuildGradle } = require("@expo/config-plugins");

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
 * Injects subprojects block into root android/build.gradle to set Kotlin JVM target 17.
 */
function withKotlinJvmTarget(config) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    if (typeof contents !== "string") return config;

    if (contents.includes('jvmTarget = "17"')) return config;

    const beforeApplyPlugin = /(\n)(apply plugin:\s*["']expo-root-project["'])/;
    contents = contents.replace(beforeApplyPlugin, `${SUBPROJECTS_BLOCK}$1$2`);

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withKotlinJvmTarget;
