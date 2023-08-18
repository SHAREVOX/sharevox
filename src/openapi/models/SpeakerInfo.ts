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
import {
    StyleInfo,
    StyleInfoFromJSON,
    StyleInfoFromJSONTyped,
    StyleInfoToJSON,
} from './';

/**
 * 話者の追加情報
 * @export
 * @interface SpeakerInfo
 */
export interface SpeakerInfo {
    /**
     * 
     * @type {string}
     * @memberof SpeakerInfo
     */
    policy: string;
    /**
     * 
     * @type {string}
     * @memberof SpeakerInfo
     */
    portrait: string;
    /**
     * 
     * @type {Array<StyleInfo>}
     * @memberof SpeakerInfo
     */
    styleInfos: Array<StyleInfo>;
}

export function SpeakerInfoFromJSON(json: any): SpeakerInfo {
    return SpeakerInfoFromJSONTyped(json, false);
}

export function SpeakerInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpeakerInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'policy': json['policy'],
        'portrait': json['portrait'],
        'styleInfos': ((json['style_infos'] as Array<any>).map(StyleInfoFromJSON)),
    };
}

export function SpeakerInfoToJSON(value?: SpeakerInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'policy': value.policy,
        'portrait': value.portrait,
        'style_infos': ((value.styleInfos as Array<any>).map(StyleInfoToJSON)),
    };
}

