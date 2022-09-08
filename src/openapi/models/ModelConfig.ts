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

import { exists, mapValues } from '../runtime';
/**
 * model_config.jsonをdictにした機械学習に利用するための情報
 * @export
 * @interface ModelConfig
 */
export interface ModelConfig {
    /**
     * 
     * @type {string}
     * @memberof ModelConfig
     */
    lengthRegulator: string;
    /**
     * 
     * @type {number}
     * @memberof ModelConfig
     */
    startId: number;
}

export function ModelConfigFromJSON(json: any): ModelConfig {
    return ModelConfigFromJSONTyped(json, false);
}

export function ModelConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lengthRegulator': json['length_regulator'],
        'startId': json['start_id'],
    };
}

export function ModelConfigToJSON(value?: ModelConfig | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'length_regulator': value.lengthRegulator,
        'start_id': value.startId,
    };
}

