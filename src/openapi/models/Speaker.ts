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
import type { SpeakerStyle } from './SpeakerStyle';
import {
    SpeakerStyleFromJSON,
    SpeakerStyleFromJSONTyped,
    SpeakerStyleToJSON,
} from './SpeakerStyle';
import type { SpeakerSupportedFeatures } from './SpeakerSupportedFeatures';
import {
    SpeakerSupportedFeaturesFromJSON,
    SpeakerSupportedFeaturesFromJSONTyped,
    SpeakerSupportedFeaturesToJSON,
} from './SpeakerSupportedFeatures';

/**
 * スピーカー情報
 * @export
 * @interface Speaker
 */
export interface Speaker {
    /**
     * 
     * @type {SpeakerSupportedFeatures}
     * @memberof Speaker
     */
    supportedFeatures?: SpeakerSupportedFeatures;
    /**
     * 
     * @type {string}
     * @memberof Speaker
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Speaker
     */
    speakerUuid: string;
    /**
     * 
     * @type {Array<SpeakerStyle>}
     * @memberof Speaker
     */
    styles: Array<SpeakerStyle>;
    /**
     * 
     * @type {string}
     * @memberof Speaker
     */
    version?: string;
}

/**
 * Check if a given object implements the Speaker interface.
 */
export function instanceOfSpeaker(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "speakerUuid" in value;
    isInstance = isInstance && "styles" in value;

    return isInstance;
}

export function SpeakerFromJSON(json: any): Speaker {
    return SpeakerFromJSONTyped(json, false);
}

export function SpeakerFromJSONTyped(json: any, ignoreDiscriminator: boolean): Speaker {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'supportedFeatures': !exists(json, 'supported_features') ? undefined : SpeakerSupportedFeaturesFromJSON(json['supported_features']),
        'name': json['name'],
        'speakerUuid': json['speaker_uuid'],
        'styles': ((json['styles'] as Array<any>).map(SpeakerStyleFromJSON)),
        'version': !exists(json, 'version') ? undefined : json['version'],
    };
}

export function SpeakerToJSON(value?: Speaker | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'supported_features': SpeakerSupportedFeaturesToJSON(value.supportedFeatures),
        'name': value.name,
        'speaker_uuid': value.speakerUuid,
        'styles': ((value.styles as Array<any>).map(SpeakerStyleToJSON)),
        'version': value.version,
    };
}

