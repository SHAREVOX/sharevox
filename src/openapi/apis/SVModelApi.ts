/* tslint:disable */
/* eslint-disable */
/**
 * SHAREVOX ENGINE
 * SHAREVOXの音声合成エンジンです。
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    HTTPValidationError,
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    SVModelInfo,
    SVModelInfoFromJSON,
    SVModelInfoToJSON,
} from '../models';

export interface PostSvModelSvModelPostRequest {
    sVModelInfo: SVModelInfo;
}

/**
 * SVModelApi - interface
 * 
 * @export
 * @interface SVModelApiInterface
 */
export interface SVModelApiInterface {
    /**
     * 
     * @summary Get Sv Models
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SVModelApiInterface
     */
    getSvModelsSvModelsGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<string>>>;

    /**
     * Get Sv Models
     */
    getSvModelsSvModelsGet(initOverrides?: RequestInit): Promise<Array<string>>;

    /**
     * svモデルを登録します。  Parameters ---------- uuid: str     モデル固有のUUID variance_model: str     variance_model.onnxをbase64エンコードした文字列 embedder_model: str     embedder_model.onnxをbase64エンコードした文字列 decoder_model: str     decoder_model.onnxをbase64エンコードした文字列 metas: List[Speakers]     モデルのメタ情報     metas.jsonをlistにしたもの model_config: ModelConfig     model_config.jsonをdictにした機械学習に利用するための情報 speaker_infos: Dict[str, SpeakerInfo]     keyをspeakerInfoのUUIDとした複数のspeaker情報
     * @summary Post Sv Model
     * @param {SVModelInfo} sVModelInfo 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SVModelApiInterface
     */
    postSvModelSvModelPostRaw(requestParameters: PostSvModelSvModelPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<any>>;

    /**
     * svモデルを登録します。  Parameters ---------- uuid: str     モデル固有のUUID variance_model: str     variance_model.onnxをbase64エンコードした文字列 embedder_model: str     embedder_model.onnxをbase64エンコードした文字列 decoder_model: str     decoder_model.onnxをbase64エンコードした文字列 metas: List[Speakers]     モデルのメタ情報     metas.jsonをlistにしたもの model_config: ModelConfig     model_config.jsonをdictにした機械学習に利用するための情報 speaker_infos: Dict[str, SpeakerInfo]     keyをspeakerInfoのUUIDとした複数のspeaker情報
     * Post Sv Model
     */
    postSvModelSvModelPost(requestParameters: PostSvModelSvModelPostRequest, initOverrides?: RequestInit): Promise<any>;

}

/**
 * 
 */
export class SVModelApi extends runtime.BaseAPI implements SVModelApiInterface {

    /**
     * Get Sv Models
     */
    async getSvModelsSvModelsGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<string>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/sv_models`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Get Sv Models
     */
    async getSvModelsSvModelsGet(initOverrides?: RequestInit): Promise<Array<string>> {
        const response = await this.getSvModelsSvModelsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * svモデルを登録します。  Parameters ---------- uuid: str     モデル固有のUUID variance_model: str     variance_model.onnxをbase64エンコードした文字列 embedder_model: str     embedder_model.onnxをbase64エンコードした文字列 decoder_model: str     decoder_model.onnxをbase64エンコードした文字列 metas: List[Speakers]     モデルのメタ情報     metas.jsonをlistにしたもの model_config: ModelConfig     model_config.jsonをdictにした機械学習に利用するための情報 speaker_infos: Dict[str, SpeakerInfo]     keyをspeakerInfoのUUIDとした複数のspeaker情報
     * Post Sv Model
     */
    async postSvModelSvModelPostRaw(requestParameters: PostSvModelSvModelPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.sVModelInfo === null || requestParameters.sVModelInfo === undefined) {
            throw new runtime.RequiredError('sVModelInfo','Required parameter requestParameters.sVModelInfo was null or undefined when calling postSvModelSvModelPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/sv_model`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SVModelInfoToJSON(requestParameters.sVModelInfo),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * svモデルを登録します。  Parameters ---------- uuid: str     モデル固有のUUID variance_model: str     variance_model.onnxをbase64エンコードした文字列 embedder_model: str     embedder_model.onnxをbase64エンコードした文字列 decoder_model: str     decoder_model.onnxをbase64エンコードした文字列 metas: List[Speakers]     モデルのメタ情報     metas.jsonをlistにしたもの model_config: ModelConfig     model_config.jsonをdictにした機械学習に利用するための情報 speaker_infos: Dict[str, SpeakerInfo]     keyをspeakerInfoのUUIDとした複数のspeaker情報
     * Post Sv Model
     */
    async postSvModelSvModelPost(requestParameters: PostSvModelSvModelPostRequest, initOverrides?: RequestInit): Promise<any> {
        const response = await this.postSvModelSvModelPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
