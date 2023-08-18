// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const process = require("process");

const VOICEVOX_ENGINE_DIR =
  process.env.VOICEVOX_ENGINE_DIR ?? "../sharevox_engine/run.dist/";

// ${productName} Web Setup ${version}.${ext}
const NSIS_WEB_ARTIFACT_NAME = process.env.NSIS_WEB_ARTIFACT_NAME;

// ${productName}-${version}.${ext}
const LINUX_ARTIFACT_NAME = process.env.LINUX_ARTIFACT_NAME;

// ${packageName}
const LINUX_EXECUTABLE_NAME = process.env.LINUX_EXECUTABLE_NAME;

// ${productName}-${version}.${ext}
const MACOS_ARTIFACT_NAME = process.env.MACOS_ARTIFACT_NAME;

const isMac = process.platform === "darwin";

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/electron/preload.ts",
      builderOptions: {
        fileAssociations: [
          {
            ext: "svproj",
            name: "SHAREVOX Project file",
            description: "SHAREVOX Project file",
            role: "Editor",
            // icon: "icons/vvproj." + (isMac ? "icns" : "ico"),
          },
          {
            ext: "vvpp",
            name: "VOICEVOX Plugin package",
            description: "VOICEVOX Plugin package",
            role: "Editor",
            icon: "icons/vvpp." + (isMac ? "icns" : "ico"),
          },
          {
            ext: "vvppp",
            name: "VOICEVOX Plugin package (part)",
            description: "VOICEVOX Plugin package (part)",
            role: "Editor",
            icon: "icons/vvpp." + (isMac ? "icns" : "ico"),
          },
          {
            ext: "svlib",
            name: "SHAREVOX Voice Library file",
            description: "SHAREVOX Voice Library file",
            role: "Editor",
          },
        ],
        extraFiles: [
          { from: "build/README.txt", to: "README.txt" },
          { from: ".env.production", to: ".env" },
          {
            from: VOICEVOX_ENGINE_DIR,
            to: "",
          },
        ],
        // electron-builder installer
        productName: "SHAREVOX",
        appId: "app.sharevox",
        copyright: "y-chan",
        afterAllArtifactBuild: path.resolve(
          __dirname,
          "build",
          "afterAllArtifactBuild.js"
        ),
        win: {
          icon: "public/icon-desktop.png",
          target: [
            {
              target: "nsis-web",
              arch: ["x64"],
            },
          ],
          sign: path.resolve(__dirname, "build", "codesign.js"),
        },
        directories: {
          buildResources: "build",
        },
        nsisWeb: {
          artifactName:
            NSIS_WEB_ARTIFACT_NAME !== "" ? NSIS_WEB_ARTIFACT_NAME : undefined,
          include: "build/installer.nsh",
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
        publish: {
          provider: "github",
          repo: "sharevox",
          vPrefixedTagName: false,
        },
        linux: {
          artifactName:
            LINUX_ARTIFACT_NAME !== "" ? LINUX_ARTIFACT_NAME : undefined,
          executableName:
            LINUX_EXECUTABLE_NAME !== "" ? LINUX_EXECUTABLE_NAME : undefined,
          icon: "public/icon-desktop.png",
          category: "AudioVideo",
          mimeTypes: ["application/x-sharevox"],
          target: [
            {
              target: "AppImage",
              arch: ["x64"],
            },
          ],
        },
        mac: {
          artifactName:
            MACOS_ARTIFACT_NAME !== "" ? MACOS_ARTIFACT_NAME : undefined,
          icon: "public/icon.icns",
          category: "public.app-category.utilities",
          target: [
            {
              target: "dmg",
              arch: ["x64"],
            },
          ],
        },
        dmg: {
          icon: "public/icon.icns",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, "node_modules")],
        },
      },
    },
  },
};
