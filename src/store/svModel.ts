import { SVModelInfo } from "@/openapi/models/SVModelInfo";
import {
  SVModelGetters,
  SVModelActions,
  SVModelMutations,
  SVModelStoreState,
  VoiceVoxStoreOptions,
} from "@/store/type";

import JSZip from "jszip";
import path from "path";
import { createUILockAction } from "./ui";

export const svModelStoreState: SVModelStoreState = {};

export const svModelStore: VoiceVoxStoreOptions<
  SVModelGetters,
  SVModelActions,
  SVModelMutations
> = {
  getters: {},
  mutations: {
    SET_SV_MODEL_INFO(state, { svModelInfo }: { svModelInfo?: SVModelInfo }) {
      state.importedSvModel = svModelInfo;
    },
  },
  actions: {
    IMPORT_SV_MODEL_INFO: createUILockAction(
      async (
        context,
        { filePath, confirm }: { filePath?: string; confirm?: boolean }
      ) => {
        if (!filePath) {
          // Select and load a ZIP File for sound library.
          filePath = await window.electron.showImportFileDialog({
            title: "サウンドライブラリ用ファイル(.svlib)の選択",
            // filters: [{ name: ".svlib file", extensions: ["svlib"] }],
            filters: [{ name: ".svlib file", extensions: ["svlib"] }],
          });
          if (!filePath) return;
        }

        const projectFileErrorMsg = `The sound library file "${filePath}" is a invalid file.`;

        try {
          const buf = await window.electron.readFile({ filePath });
          const zip = await JSZip.loadAsync(buf);
          const svModelInfoObj = <SVModelInfo>{};

          zip.forEach(async (relativePath, zipObject) => {
            // ignore environment differences such as Win/Mac/Linux
            // e.g.) ['3c888f14-b4b8-11ec-89e6-0242ac1c0002', 'voice_samples', '1758075148_003.wav']
            // separatedPath[0]                   => should be speaker_uuid
            // separatedPath[1] is icons          => should be icon, so read separatedPath[2]
            // separatedPath[1] is voice_samples  => should be wav data, so read separatedPath[2]
            // others                             => read separatedPath[1](should be file name)
            const separatedPath = relativePath.split(path.sep);
            if (separatedPath.length == 0) {
              console.error(`${filePath} should be invalid`);
              return;
            }

            const fileExt: string = path.extname(relativePath);
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

            const speaker_uuid: string = separatedPath[0];
            zipObject.async(convertType).then((data) => {
              console.log(separatedPath);
              console.log(data);
            });

            // given files
            // - variance_model
            // - embedder_model
            // - decoder_model
            // - speaker_infos
            //   - portrait.png
            //   - style_infos:
            //     uuid: {
            //       - icon: <id>.png
            //       - voice_samples: [
            //         <id>_00<n>.wav
            //       ]
            //     }

            // console.log(separatedPath);
            // console.log(zipObject);
            // TODO: read data from zipObject
          });

          // console.log(svModelInfoObj);
          // console.log(confirm);

          // setするとき
          context.commit("SET_SV_MODEL_INFO", { svModelInfo: svModelInfoObj });
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
    REGISTER_SV_MODEL: createUILockAction(
      async ({ dispatch, state }, { svModelInfo }) => {
        const engineId: string | undefined = state.engineIds[0]; // TODO: 複数エンジン対応
        if (engineId === undefined)
          throw new Error(`No such engine registered: index == 0`);

        return dispatch("INSTANTIATE_ENGINE_CONNECTOR", {
          engineId,
        })
          .then((instance) =>
            instance.invoke("postSvModelSvModelPost")({
              sVModelInfo: svModelInfo,
            })
          )
          .then(() => {
            return true;
          })
          .catch((e) => {
            window.electron.logError(e);
            return false;
          });
      }
    ),
    GET_SV_MODELS: createUILockAction(async ({ dispatch, state }) => {
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
};
