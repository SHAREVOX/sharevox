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
import type { LibrarySpeaker } from './LibrarySpeaker';
import {
    LibrarySpeakerFromJSON,
    LibrarySpeakerFromJSONTyped,
    LibrarySpeakerToJSON,
} from './LibrarySpeaker';

/**
 * ダウンロード可能な音声ライブラリの情報
 * @export
 * @interface DownloadableLibrary
 */
export interface DownloadableLibrary {
    /**
     * 
     * @type {string}
     * @memberof DownloadableLibrary
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof DownloadableLibrary
     */
    uuid: string;
    /**
     * 
     * @type {string}
     * @memberof DownloadableLibrary
     */
    version: string;
    /**
     * 
     * @type {string}
     * @memberof DownloadableLibrary
     */
    downloadUrl: string;
    /**
     * 
     * @type {number}
     * @memberof DownloadableLibrary
     */
    bytes: number;
    /**
     * 
     * @type {Array<LibrarySpeaker>}
     * @memberof DownloadableLibrary
     */
    speakers: Array<LibrarySpeaker>;
}

/**
 * Check if a given object implements the DownloadableLibrary interface.
 */
export function instanceOfDownloadableLibrary(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "uuid" in value;
    isInstance = isInstance && "version" in value;
    isInstance = isInstance && "downloadUrl" in value;
    isInstance = isInstance && "bytes" in value;
    isInstance = isInstance && "speakers" in value;

    return isInstance;
}

export function DownloadableLibraryFromJSON(json: any): DownloadableLibrary {
    return DownloadableLibraryFromJSONTyped(json, false);
}

export function DownloadableLibraryFromJSONTyped(json: any, ignoreDiscriminator: boolean): DownloadableLibrary {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'uuid': json['uuid'],
        'version': json['version'],
        'downloadUrl': json['download_url'],
        'bytes': json['bytes'],
        'speakers': ((json['speakers'] as Array<any>).map(LibrarySpeakerFromJSON)),
    };
}

export function DownloadableLibraryToJSON(value?: DownloadableLibrary | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'uuid': value.uuid,
        'version': value.version,
        'download_url': value.downloadUrl,
        'bytes': value.bytes,
        'speakers': ((value.speakers as Array<any>).map(LibrarySpeakerToJSON)),
    };
}

