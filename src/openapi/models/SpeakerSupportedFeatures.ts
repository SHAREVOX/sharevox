/* tslint:disable */
/* eslint-disable */
/**
 * SHAREVOX Engine
 * SHAREVOXの音声合成エンジンです。
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { SpeakerSupportPermittedSynthesisMorphing } from './SpeakerSupportPermittedSynthesisMorphing';
import {
    SpeakerSupportPermittedSynthesisMorphingFromJSON,
    SpeakerSupportPermittedSynthesisMorphingFromJSONTyped,
    SpeakerSupportPermittedSynthesisMorphingToJSON,
} from './SpeakerSupportPermittedSynthesisMorphing';

/**
 * 話者の対応機能の情報
 * @export
 * @interface SpeakerSupportedFeatures
 */
export interface SpeakerSupportedFeatures {
    /**
     * 
     * @type {SpeakerSupportPermittedSynthesisMorphing}
     * @memberof SpeakerSupportedFeatures
     */
    permittedSynthesisMorphing?: SpeakerSupportPermittedSynthesisMorphing;
}

/**
 * Check if a given object implements the SpeakerSupportedFeatures interface.
 */
export function instanceOfSpeakerSupportedFeatures(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SpeakerSupportedFeaturesFromJSON(json: any): SpeakerSupportedFeatures {
    return SpeakerSupportedFeaturesFromJSONTyped(json, false);
}

export function SpeakerSupportedFeaturesFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpeakerSupportedFeatures {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'permittedSynthesisMorphing': !exists(json, 'permitted_synthesis_morphing') ? undefined : SpeakerSupportPermittedSynthesisMorphingFromJSON(json['permitted_synthesis_morphing']),
    };
}

export function SpeakerSupportedFeaturesToJSON(value?: SpeakerSupportedFeatures | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'permitted_synthesis_morphing': SpeakerSupportPermittedSynthesisMorphingToJSON(value.permittedSynthesisMorphing),
    };
}

