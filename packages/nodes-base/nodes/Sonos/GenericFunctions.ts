import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
  IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

/**
 * Make an API request to Sonos
 * API DOCS: https://api.playsignage.com/docs
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
 export async function sonosApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string | undefined): Promise<any> { // tslint:disable-line:no-any
	const options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs: query,
		uri: uri || `https://api.ws.sonos.com/control/api/v1/${endpoint}`,
		json: true,
	};
	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		if (!Object.keys(query).length) {
      delete options.qs;
    }
		//@ts-ignore
  return await this.helpers.requestOAuth2.call(this, 'sonosOAuth2Api', options, {/* tokenType: 'Bearer' */});
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}