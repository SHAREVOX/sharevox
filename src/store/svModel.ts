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
            filters: [{ name: ".svlib file", extensions: ["svlib"] }],
          });
          if (!filePath) return;
        }

        const projectFileErrorMsg = `The sound library file "${filePath}" is a invalid file.`;

        try {
          // 音声ライブラリのZIPファイルをロード
          const buf = await window.electron.readFile({ filePath });

          // ZIPファイルの解凍と型変換
          const jsZip = await JSZip.loadAsync(buf);
          const svModelInfoObj = <SVModelInfo>{};
          jsZip.forEach(async (relativePath, zipObject) => {
            // WinやMacといった環境差異を吸収するためにpathライブラリを利用する
            // ['3c888f14-b4b8-11ec-89e6-0242ac1c0002', 'voice_samples', '1758075148_003.wav']
            // separatedPath[0]はspeaker_uuidになる
            // separatedPath[1]がiconsの時はiconを想定してseparatedPath[2]を読む
            // separatedPath[1]がvoice_samplesの時は音声サンプルを想定してseparatedPath[2]を読む
            // それ以外はseparatedPath[1]を読む
            //
            // 想定ファイルたち
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
            const separatedPath = relativePath.split(path.sep);
            // base64エンコードする
            // 似てるコードはプロジェクト内から探す

            // ref: audio.ts#1288
            // const base64Encoder = (blob: Blob): Promise<string | undefined> => {
            //     return new Promise((resolve, reject) => {
            //       const reader = new FileReader();
            //       reader.onload = () => {
            //         // string/undefined以外が来ることはないと思うが、型定義的にArrayBufferも来るので、toStringする
            //         const result = reader.result?.toString();
            //         if (result) {
            //           // resultの中身は、"data:audio/wav;base64,<content>"という形なので、カンマ以降を抜き出す
            //           resolve(result.slice(result.indexOf(",") + 1));
            //         } else {
            //           reject();
            //         }
            //       };
            //       reader.readAsDataURL(blob);
            //     });
            //   };

            console.log(separatedPath);
            console.log(zipObject);
          });

          console.log(svModelInfoObj);
          console.log(confirm);

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
  },
};
