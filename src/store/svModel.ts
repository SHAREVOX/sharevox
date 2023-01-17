import { ModelConfigFromJSON, SpeakerFromJSON } from "@/openapi/models";
import { SVModelInfo } from "@/openapi/models/SVModelInfo";
import {
  SVModelStoreTypes,
  SVModelStoreState,
  transformCommandStore,
} from "@/store/type";

import JSZip from "jszip";
import path from "path";
import { createPartialStore } from "./vuex";
import { createUILockAction } from "./ui";

export const svModelStoreState: SVModelStoreState = {};

export const svModelStore = transformCommandStore(
  createPartialStore<SVModelStoreTypes>({
    SET_SV_MODEL_INFO: {
      mutation(state, { svModelInfo }: { svModelInfo?: SVModelInfo }) {
        state.importedSvModel = svModelInfo;
      },
    },
    IMPORT_SV_MODEL_INFO: {
      action: createUILockAction(
        async (
          context,
          { filePath, confirm }: { filePath: string; confirm?: boolean }
        ) => {
          const projectFileErrorMsg = `The sound library file "${filePath}" is a invalid file.`;

          try {
            const buf = await window.electron.readFile({ filePath });
            const zip = await JSZip.loadAsync(buf);

            const svModelInfoObj = <SVModelInfo>{};

            const convertTypeSwitcher = (fileExt: string) => {
              let convertType: JSZip.OutputType;
              switch (fileExt) {
                case ".png":
                case ".onnx":
                case ".wav":
                  convertType = "base64";
                  break;
                default:
                  convertType = "string";
                  break;
              }
              return convertType;
            };

            // metas無しにspeaker_infoを構築するのが難しいので先にモデルの情報だけ処理する
            const modelProcesses = Object.keys(zip.files).map(
              async (relativePath) => {
                const zipObject = zip.files[relativePath];
                // ignore environment differences such as Win/Mac/Linux
                const separatedPath = relativePath.split(path.sep);
                if (separatedPath.length == 0) {
                  console.error(`${filePath} should be invalid`);
                  return;
                }

                const fileExt: string = path.extname(relativePath);
                const convertType = convertTypeSwitcher(fileExt);

                // e.g.) ['svlib', 'test', 'decoder_model.onnx']
                // separatedPath[0]                   => should be svlib
                // separatedPath[1]                   => should be speaker_uuid
                // separatedPath[2] is icons          => should be icon, so read separatedPath[3]
                // separatedPath[2] is voice_samples  => should be wav data, so read separatedPath[3]
                // others                             => read separatedPath[1](should be file name)
                const filename = path.basename(relativePath);
                // 必要なものだけ読み込んで処理速度を上げる
                if (filename.endsWith(".onnx") || filename.endsWith(".json")) {
                  const data = await zipObject.async(convertType);

                  let metas: Record<string, unknown>[];
                  const convertedMetas = [];
                  switch (filename) {
                    case "embedder_model.onnx":
                      svModelInfoObj.uuid = separatedPath[1];
                      svModelInfoObj.embedderModel = data;
                      break;
                    case "decoder_model.onnx":
                      svModelInfoObj.decoderModel = data;
                      break;
                    case "variance_model.onnx":
                      svModelInfoObj.varianceModel = data;
                      break;
                    case "metas.json":
                      metas = JSON.parse(data);
                      // snake to camel case
                      for (const meta of metas) {
                        convertedMetas.push(SpeakerFromJSON(meta));
                      }
                      svModelInfoObj.metas = convertedMetas;
                      break;
                    case "model_config.json":
                      // snake to camel case
                      svModelInfoObj.modelConfig = ModelConfigFromJSON(
                        JSON.parse(data)
                      );
                      break;
                    default:
                      console.log("unknown file:", filename);
                      break;
                  }
                }
              }
            );
            await Promise.all(modelProcesses);

            if (
              !svModelInfoObj.modelConfig ||
              !svModelInfoObj.metas ||
              !svModelInfoObj.varianceModel ||
              !svModelInfoObj.embedderModel ||
              !svModelInfoObj.decoderModel
            )
              throw Error("Invalid library format (not found model files)");
            const styleIdOffset = svModelInfoObj.modelConfig.startId;

            // プレースホルダを作る
            svModelInfoObj.speakerInfos = {};
            for (const meta of svModelInfoObj.metas) {
              svModelInfoObj.speakerInfos[meta.speakerUuid] = {
                policy: "",
                portrait: "",
                styleInfos: meta.styles.map((value) => {
                  return {
                    id: value.id + styleIdOffset,
                    icon: "",
                    voiceSamples: ["", "", ""],
                  };
                }),
              };
            }

            const speakerInfoProcesses = Object.keys(zip.files).map(
              async (relativePath) => {
                const zipObject = zip.files[relativePath];
                // ignore environment differences such as Win/Mac/Linux
                const separatedPath = relativePath.split(path.sep);
                if (separatedPath.length == 0) {
                  console.error(`${filePath} should be invalid`);
                  return;
                }

                const fileExt: string = path.extname(relativePath);
                const convertType = convertTypeSwitcher(fileExt);

                const filename = path.basename(relativePath);
                if (filename.endsWith(".onnx") || filename.endsWith(".json")) {
                  return;
                }
                const data = await zipObject.async(convertType);

                // TODO: もう少し可読性を何とかしたい
                const filenameWithoutExt = filename.split(".")[0];
                let uuid = "";
                let dirname = "";
                let idAndIndex: string[] = [];
                let id = 0;
                let index = 0;
                let styleIndex = 0;
                switch (fileExt) {
                  case ".wav":
                    uuid = separatedPath[2];
                    if (svModelInfoObj.speakerInfos[uuid] === undefined) {
                      throw Error("Invalid library format (speaker info)");
                    }
                    dirname = separatedPath[3];
                    if (dirname !== "voice_samples") {
                      throw Error(
                        "Invalid library format (voice sample folder)"
                      );
                    }
                    idAndIndex = filenameWithoutExt.split("_");
                    if (idAndIndex.length !== 2) {
                      throw Error("Invalid library format (voice sample name)");
                    }
                    id = parseInt(idAndIndex[0]);
                    index = parseInt(idAndIndex[1]);
                    if (isNaN(id) || isNaN(index)) {
                      throw Error("Invalid library format (voice sample name)");
                    }
                    styleIndex = svModelInfoObj.speakerInfos[
                      uuid
                    ].styleInfos.findIndex((value) => value.id === id);
                    if (styleIndex === -1) {
                      throw Error("Invalid library format (voice sample name)");
                    }
                    // indexは1始まりなので1引く
                    svModelInfoObj.speakerInfos[uuid].styleInfos[
                      styleIndex
                    ].voiceSamples[index - 1] = data;
                    break;
                  case ".png":
                    uuid = separatedPath[2];
                    if (svModelInfoObj.speakerInfos[uuid] === undefined) {
                      throw Error("Invalid library format (speaker info)");
                    }
                    if (filename === "portrait.png") {
                      svModelInfoObj.speakerInfos[uuid].portrait = data;
                    } else {
                      const id = parseInt(filenameWithoutExt);
                      if (isNaN(id)) {
                        throw Error("Invalid library format (style icon name)");
                      }
                      const styleIndex = svModelInfoObj.speakerInfos[
                        uuid
                      ].styleInfos.findIndex((value) => value.id === id);
                      if (styleIndex === -1) {
                        throw Error("Invalid library format (icon name)");
                      }
                      svModelInfoObj.speakerInfos[uuid].styleInfos[
                        styleIndex
                      ].icon = data;
                    }
                    break;
                  case ".md":
                    if (filenameWithoutExt === "policy") {
                      uuid = separatedPath[2];
                      if (svModelInfoObj.speakerInfos[uuid] === undefined) {
                        throw Error("Invalid library format (speaker info)");
                      }
                      svModelInfoObj.speakerInfos[uuid].policy = data;
                      break;
                    } else {
                      console.log("unknown file:", filename);
                      break;
                    }
                  default:
                    console.log("unknown file:", filename);
                    break;
                }
              }
            );

            await Promise.all(speakerInfoProcesses).catch((e) => {
              throw Error(e);
            });

            // setするとき
            context.commit("SET_SV_MODEL_INFO", {
              svModelInfo: svModelInfoObj,
            });
            // 読み込むとき
            // context.state.importedSvModel
            return;
          } catch (err) {
            window.electron.logError(err);
            const message = (() => {
              if (typeof err === "string") return err;
              if (!(err instanceof Error)) return "エラーが発生しました。";
              if (err.message.startsWith(projectFileErrorMsg))
                return "ファイルフォーマットが正しくありません。";
              return err.message;
            })();
            await window.electron.showMessageDialog({
              type: "error",
              title: "エラー",
              message,
            });
          }

          // ロードした音声ファイルを表示するページを追加
          // ライブラリの規約を表示する画面を追加
          // キャンセルダイアログの表示
          // インストールダイアログ
          // インストールダイアログ表示ダイアログ
          return;
        }
      ),
    },
    RESET_SV_MODEL_INFO: {
      action: ({ commit }) => {
        commit("SET_SV_MODEL_INFO", { svModelInfo: undefined });
      },
    },
    REGISTER_SV_MODEL: {
      action: createUILockAction(async ({ dispatch, state }) => {
        const engineId: string | undefined = state.engineIds[0]; // TODO: 複数エンジン対応
        if (engineId === undefined)
          throw new Error(`No such engine registered: index == 0`);
        const sVModelInfo = state.importedSvModel;
        if (sVModelInfo === undefined)
          throw new Error("Sv Model Info is undefined");

        return dispatch("INSTANTIATE_ENGINE_CONNECTOR", {
          engineId,
        })
          .then((instance) =>
            instance.invoke("postSvModelSvModelPost")({
              sVModelInfo,
            })
          )
          .then(async () => {
            await dispatch("RESET_SV_MODEL_INFO");
            return true;
          })
          .catch((e) => {
            window.electron.logError(e);
            return false;
          });
      }),
    },
    GET_SV_MODELS: {
      action: createUILockAction(async ({ dispatch, state }) => {
        const engineId: string | undefined = state.engineIds[0]; // TODO: 複数エンジン対応
        if (engineId === undefined)
          throw new Error(`No such engine registered: index == 0`);

        return dispatch("INSTANTIATE_ENGINE_CONNECTOR", {
          engineId,
        })
          .then((instance) => instance.invoke("getSvModelsSvModelsGet")({}))
          .then((svModels) => {
            return svModels;
          })
          .catch((e) => {
            window.electron.logError(e);
            return null;
          });
      }),
    },
  })
);