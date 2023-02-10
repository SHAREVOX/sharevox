/* tslint:disable */
/* eslint-disable */
/**
 * SHAREVOX Engine
 * SHAREVOXの音声合成エンジンです。
 *
 * The version of the OpenAPI document: 0.2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ParseKanaBadRequest
 */
export interface ParseKanaBadRequest {
    /**
     * 
     * @type {string}
     * @memberof ParseKanaBadRequest
     */
    text: string;
    /**
     * |name|description|
     * |---|---|
     * | UNKNOWN_TEXT | 判別できない読み仮名があります: {text} |
     * | ACCENT_TOP | 句頭にアクセントは置けません: {text} |
     * | ACCENT_TWICE | 1つのアクセント句に二つ以上のアクセントは置けません: {text} |
     * | ACCENT_NOTFOUND | アクセントを指定していないアクセント句があります: {text} |
     * | EMPTY_PHRASE | {position}番目のアクセント句が空白です |
     * | INTERROGATION_MARK_NOT_AT_END | アクセント句末以外に「？」は置けません: {text} |
     * | INFINITE_LOOP | 処理時に無限ループになってしまいました...バグ報告をお願いします。 |
     * @type {string}
     * @memberof ParseKanaBadRequest
     */
    errorName: string;
    /**
     * 
     * @type {{ [key: string]: string; }}
     * @memberof ParseKanaBadRequest
     */
    errorArgs: { [key: string]: string; };
}

export function ParseKanaBadRequestFromJSON(json: any): ParseKanaBadRequest {
    return ParseKanaBadRequestFromJSONTyped(json, false);
}

export function ParseKanaBadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ParseKanaBadRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'text': json['text'],
        'errorName': json['error_name'],
        'errorArgs': json['error_args'],
    };
}

export function ParseKanaBadRequestToJSON(value?: ParseKanaBadRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'text': value.text,
        'error_name': value.errorName,
        'error_args': value.errorArgs,
    };
}

