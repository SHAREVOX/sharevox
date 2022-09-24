<template>
  <q-dialog
    maximized
    transition-show="jump-up"
    transition-hide="jump-down"
    class="transparent-backdrop"
    v-model="modelValueComputed"
  >
    <q-layout container view="hHh Lpr lff" class="bg-background">
      <q-header class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title class="text-display"
            >音声ライブラリインストール</q-toolbar-title
          >
          <q-space />
          <div class="row items-center no-wrap">
            <template v-if="pageIndex === 0">
              <q-btn
                unelevated
                label="キャンセル"
                color="toolbar-button"
                text-color="toolbar-button-display"
                class="text-no-wrap q-mr-md"
                @click="cancelInstall"
              />
              <q-btn
                unelevated
                label="次へ"
                color="toolbar-button"
                text-color="toolbar-button-display"
                class="text-no-wrap"
                @click="nextPage"
              />
            </template>
            <template v-else>
              <q-btn
                unelevated
                label="戻る"
                color="toolbar-button"
                text-color="toolbar-button-display"
                class="text-no-wrap q-mr-md"
                @click="prevPage"
              />
              <q-btn
                unelevated
                label="利用規約に同意してインストール"
                color="toolbar-button"
                text-color="toolbar-button-display"
                class="text-no-wrap"
                @click="startInstall"
              />
            </template>
          </div>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page>
          <div v-if="!loadedModel || installingModel" class="loading">
            <div>
              <q-spinner color="primary" size="2.5rem" />
              <div class="q-mt-xs">
                {{
                  installingModel ? "インストール中・・・" : "読み込み中・・・"
                }}
              </div>
            </div>
          </div>
          <q-tab-panels v-model="pageIndex" v-if="loadedModel">
            <!-- 試聴・モデル確認画面 -->
            <q-tab-panel :name="0">
              <q-drawer
                bordered
                show-if-above
                :model-value="true"
                :width="$q.screen.width / 3 > 300 ? 300 : $q.screen.width / 3"
                :breakpoint="0"
              >
                <div class="character-portrait-wrapper">
                  <img
                    :src="
                      base64ToUrl(
                        newCharacters[selectedCharacter].portrait,
                        'image/png'
                      )
                    "
                    class="character-portrait"
                  />
                </div>
              </q-drawer>
              <div class="text-h6 sample-voice-title">サンプルボイス一覧</div>
              <div class="character-items-container">
                <div>
                  <q-item
                    v-for="(speakerInfo, speakerUuid) in newCharacters"
                    :key="speakerUuid"
                    clickable
                    v-ripple="isHoverableItem"
                    class="q-pa-none character-item"
                    :class="[
                      isHoverableItem && 'hoverable-character-item',
                      selectedCharacter === speakerUuid &&
                        'selected-character-item',
                    ]"
                    @click="
                      selectCharacter(speakerUuid);
                      togglePlayOrStop(
                        speakerUuid,
                        selectedStyles[speakerUuid],
                        0
                      );
                    "
                  >
                    <div class="character-item-inner">
                      <img
                        :src="selectedStyles[speakerUuid].icon"
                        class="style-icon"
                      />
                      <span class="text-subtitle1 q-ma-sm">{{
                        newCharacterMetas[speakerUuid].name
                      }}</span>
                      <div
                        v-if="newCharacterMetas[speakerUuid].styles.length > 1"
                        class="style-select-container"
                      >
                        <q-btn
                          flat
                          dense
                          icon="chevron_left"
                          text-color="display"
                          class="style-select-button"
                          @mouseenter="isHoverableItem = false"
                          @mouseleave="isHoverableItem = true"
                          @click.stop="
                            selectCharacter(speakerUuid);
                            rollStyleIndex(speakerUuid, -1);
                          "
                        />
                        <span>{{
                          selectedStyles[speakerUuid].styleName || "ノーマル"
                        }}</span>
                        <q-btn
                          flat
                          dense
                          icon="chevron_right"
                          text-color="display"
                          class="style-select-button"
                          @mouseenter="isHoverableItem = false"
                          @mouseleave="isHoverableItem = true"
                          @click.stop="
                            selectCharacter(speakerUuid);
                            rollStyleIndex(speakerUuid, 1);
                          "
                        />
                      </div>
                      <div class="voice-samples">
                        <q-btn
                          v-for="voiceSampleIndex of [...Array(3).keys()]"
                          :key="voiceSampleIndex"
                          round
                          outline
                          :icon="
                            playing != undefined &&
                            speakerUuid === playing.speakerUuid &&
                            selectedStyles[speakerUuid].id ===
                              playing.styleId &&
                            voiceSampleIndex === playing.index
                              ? 'stop'
                              : 'play_arrow'
                          "
                          color="primary-light"
                          class="voice-sample-btn"
                          @mouseenter="isHoverableItem = false"
                          @mouseleave="isHoverableItem = true"
                          @click.stop="
                            selectCharacter(speakerUuid);
                            togglePlayOrStop(
                              speakerUuid,
                              selectedStyles[speakerUuid],
                              voiceSampleIndex
                            );
                          "
                        />
                      </div>
                    </div>
                  </q-item>
                </div>
              </div>
            </q-tab-panel>
            <!-- 利用規約画面 -->
            <q-tab-panel :name="1" class="markdown-body overflow-auto">
              <div class="markdown q-pa-xl" v-html="policyHtml" />
            </q-tab-panel>
          </q-tab-panels>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "@/store";
import { Speaker, StyleInfo } from "@/openapi";
import { useQuasar } from "quasar";
import { useMarkdownIt } from "@/plugins/markdownItPlugin";

type CustomStyleInfo = StyleInfo & { styleName?: string };

export default defineComponent({
  name: "ImportSvModelInfoDialog",

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const modelValueComputed = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val),
    });

    const store = useStore();
    const $q = useQuasar();

    const pageIndex = ref(0);
    const loadedModel = computed(
      () => Object.keys(newCharacters.value).length > 0
    );
    const installingModel = ref(false);
    watch(
      () => modelValueComputed.value,
      (newValue, oldValue) => {
        if (!oldValue && newValue && newCharacters.value) {
          pageIndex.value = 0;
        }
      }
    );

    const base64ToUrl = function (base64: string, type: string) {
      const buffer = Buffer.from(base64, "base64");
      const iconBlob = new Blob([buffer.buffer], { type: type });
      return URL.createObjectURL(iconBlob);
    };

    const newCharacters = computed(
      () => store.state.importedSvModel?.speakerInfos ?? {}
    );
    const newCharacterMetas = computed(() => {
      const metas: Record<string, Speaker> = {};
      store.state.importedSvModel?.metas.forEach((value) => {
        metas[value.speakerUuid] = value;
      });
      return metas;
    });

    // 選択中のスタイル
    const selectedStyleIndexes = ref<Record<string, number>>({});
    const selectedStyles = computed(() => {
      const map: { [key: string]: CustomStyleInfo } = {};
      for (const speakerUuid in newCharacters.value) {
        const speakerInfo = newCharacters.value[speakerUuid];
        const selectedStyleIndex: number | undefined =
          selectedStyleIndexes.value[speakerUuid];
        const apiFormatStyleInfo =
          speakerInfo.styleInfos[selectedStyleIndex ?? 0];
        const modelConfig = store.state.importedSvModel?.modelConfig;
        if (modelConfig === null || modelConfig === undefined) return undefined;
        const metasStyleInfo = newCharacterMetas.value[speakerUuid].styles.find(
          (value) => value.id + modelConfig.startId === apiFormatStyleInfo.id
        );
        if (metasStyleInfo === undefined) return undefined;
        map[speakerUuid] = {
          id: apiFormatStyleInfo.id,
          styleName: metasStyleInfo.name,
          icon: base64ToUrl(apiFormatStyleInfo.icon, "image/png"),
          voiceSamples: apiFormatStyleInfo.voiceSamples.map((value) =>
            base64ToUrl(value, "audio/wav")
          ),
        };
      }
      return map;
    });

    // 選択中のキャラクター
    const selectedCharacter = ref("");
    const selectCharacter = (speakerUuid: string) => {
      selectedCharacter.value = speakerUuid;
    };
    // モデルがロードできたときに初期値を求める
    watch(
      () => loadedModel.value,
      (newValue, oldValue) => {
        if (!oldValue && newValue && newCharacters.value) {
          const speakerUuids = Object.keys(newCharacters.value);
          selectedCharacter.value = speakerUuids[0];
        }
      }
    );

    // キャラクター枠のホバー状態を表示するかどうか
    // 再生ボタンなどにカーソルがある場合はキャラクター枠のホバーUIを表示しないようにするため
    const isHoverableItem = ref(true);

    // 音声再生
    const playing =
      ref<{ speakerUuid: string; styleId: number; index: number }>();

    const audio = new Audio();
    audio.volume = 0.5;
    audio.onended = () => stop();

    const play = (
      speakerUuid: string,
      { id, voiceSamples }: CustomStyleInfo,
      index: number
    ) => {
      if (audio.src !== "") stop();

      audio.src = voiceSamples[index];
      audio.play();
      playing.value = { speakerUuid, styleId: id, index };
    };
    const stop = () => {
      if (audio.src === "") return;

      audio.pause();
      audio.removeAttribute("src");
      playing.value = undefined;
    };

    // 再生していたら停止、再生していなかったら再生
    const togglePlayOrStop = (
      speakerUuid: string,
      styleInfo: CustomStyleInfo,
      index: number
    ) => {
      if (
        playing.value === undefined ||
        speakerUuid !== playing.value.speakerUuid ||
        styleInfo.id !== playing.value.styleId ||
        index !== playing.value.index
      ) {
        play(speakerUuid, styleInfo, index);
      } else {
        stop();
      }
    };

    // スタイル番号をずらす
    const rollStyleIndex = (speakerUuid: string, diff: number) => {
      // 0 <= index <= length に収める
      const length = newCharacters.value[speakerUuid].styleInfos.length;
      const selectedStyleIndex: number | undefined =
        selectedStyleIndexes.value[speakerUuid];

      let styleIndex = (selectedStyleIndex ?? 0) + diff;
      styleIndex = styleIndex < 0 ? length - 1 : styleIndex % length;
      selectedStyleIndexes.value[speakerUuid] = styleIndex;

      // 音声を再生する。同じstyleIndexだったら停止する。
      if (!selectedStyles.value) return;
      const selectedStyleInfo = selectedStyles.value[speakerUuid];
      togglePlayOrStop(speakerUuid, selectedStyleInfo, 0);
    };

    const md = useMarkdownIt();
    const policyHtml = computed(() => {
      let result = "";
      for (const speakerUuid in newCharacters.value) {
        result += md.render(newCharacters.value[speakerUuid].policy);
      }
      return result;
    });

    const cancelInstall = () => {
      stop();
      $q.dialog({
        title: "インストールのキャンセル",
        message:
          "音声ライブラリのインストールをキャンセルします。<br/>よろしいですか？",
        html: true,
        persistent: true,
        focus: "cancel",
        ok: {
          label: "はい",
          flat: true,
          textColor: "display",
        },
        cancel: {
          label: "いいえ",
          flat: true,
          textColor: "display",
        },
      }).onOk(() => {
        store.dispatch("RESET_SV_MODEL_INFO");
        modelValueComputed.value = false;
      });
    };

    const startInstall = async () => {
      installingModel.value = true;
      const success = await store.dispatch("REGISTER_SV_MODEL");
      installingModel.value = false;
      if (success) {
        $q.dialog({
          title: "インストール完了",
          message: "音声ライブラリを反映するため、エンジンを再起動します。",
          persistent: true,
          focus: "cancel",
          ok: {
            label: "はい",
            flat: true,
            textColor: "display",
          },
        }).onOk(async () => {
          modelValueComputed.value = false;
          const engineId: string | undefined = store.state.engineIds[0]; // TODO: 複数エンジン対応
          if (engineId === undefined)
            throw new Error(`No such engine registered: index == 0`);
          await store.dispatch("RESTART_ENGINE", { engineId });
          await store.dispatch("LOAD_CHARACTER");
          await store.dispatch("LOAD_USER_CHARACTER_ORDER");
          await store.dispatch("LOAD_DEFAULT_STYLE_IDS");
          await store.dispatch("IS_CHARACTER_ORDER_DIALOG_OPEN", {
            isCharacterOrderDialogOpen: true,
          });
          let isDefaultStyleSelectDialogOpen = false;
          const characterInfos = store.state.characterInfos;
          if (characterInfos == undefined) throw new Error();
          for (const info of characterInfos) {
            isDefaultStyleSelectDialogOpen ||=
              info.metas.styles.length > 1 &&
              (await store.dispatch("IS_UNSET_DEFAULT_STYLE_ID", {
                speakerUuid: info.metas.speakerUuid,
              }));
          }
          await store.dispatch("IS_DEFAULT_STYLE_SELECT_DIALOG_OPEN", {
            isDefaultStyleSelectDialogOpen,
          });
        });
      } else {
        $q.dialog({
          title: "音声ライブラリのインストールに失敗しました",
          message:
            "既に音声ライブラリがインストールされていませんか？<br />そうでない場合、エンジンの再起動をお試しください。",
          html: true,
          persistent: true,
          focus: "cancel",
          ok: {
            label: "閉じる",
            flat: true,
            textColor: "display",
          },
        }).onOk(() => {
          modelValueComputed.value = false;
          store.dispatch("RESET_SV_MODEL_INFO");
        });
      }
    };

    const prevPage = () => {
      stop();
      pageIndex.value--;
    };
    const nextPage = () => {
      stop();
      pageIndex.value++;
    };

    return {
      modelValueComputed,
      pageIndex,
      loadedModel,
      installingModel,
      newCharacters,
      newCharacterMetas,
      selectedStyles,
      selectedCharacter,
      selectedStyleIndexes,
      selectCharacter,
      base64ToUrl,
      isHoverableItem,
      playing,
      togglePlayOrStop,
      rollStyleIndex,
      policyHtml,
      cancelInstall,
      startInstall,
      prevPage,
      nextPage,
    };
  },
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as vars;
@use '@/styles/colors' as colors;

.character-portrait-wrapper {
  display: grid;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .character-portrait {
    margin: auto;
  }
}

.q-tab-panels {
  height: calc(
    100vh - #{vars.$menubar-height + vars.$header-height +
      vars.$window-border-width}
  );

  > :deep(.scroll) {
    overflow-y: hidden;
    .q-tab-panel {
      padding: 5px 16px;
    }
  }

  $voice-sample-title-height: 30px;
  .voice-sample-title-height {
    height: $voice-sample-title-height;
  }

  .character-items-container {
    display: grid;
    align-items: center;
    height: calc(100% - #{$voice-sample-title-height});

    > div {
      $character-item-size: 215px;
      display: grid;
      grid-template-columns: repeat(auto-fit, $character-item-size);
      grid-auto-rows: $character-item-size;
      column-gap: 10px;
      row-gap: 10px;
      align-content: center;
      justify-content: center;
      .character-item {
        box-shadow: 0 0 0 1px rgba(colors.$primary-light-rgb, 0.5);
        border-radius: 10px;
        overflow: hidden;
        &.selected-character-item {
          box-shadow: 0 0 0 2px colors.$primary-light;
        }
        &:hover :deep(.q-focus-helper) {
          opacity: 0 !important;
        }
        &.hoverable-character-item:hover :deep(.q-focus-helper) {
          opacity: 0.15 !important;
        }
        .character-item-inner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          .style-icon {
            $icon-size: $character-item-size / 2;
            width: $icon-size;
            height: $icon-size;
            border-radius: 5px;
          }
          .style-select-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: -1rem;
          }
          .voice-samples {
            display: flex;
            column-gap: 5px;
            align-items: center;
            justify-content: center;
          }
          .new-character-item {
            color: colors.$primary-light;
            position: absolute;
            left: 0px;
            top: 0px;
          }
        }
      }
    }
  }
}

.loading {
  background-color: rgba(colors.$display-rgb, 0.15);
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;

  > div {
    color: colors.$display;
    background: colors.$background;
    border-radius: 6px;
    padding: 14px;
  }
}

@media screen and (max-width: 700px) {
  .q-drawer-container {
    display: none;
  }
  .q-page-container {
    padding-left: unset !important;
    .q-page-sticky {
      left: 0 !important;
    }
  }
}
</style>
