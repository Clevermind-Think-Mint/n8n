import {
  IExecuteFunctions,
  ILoadOptionsFunctions
} from 'n8n-core';

import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
  INodePropertyOptions
} from 'n8n-workflow';

import {
	sonosApiRequest,
} from './GenericFunctions';

import * as _ from 'lodash';

export class Sonos implements INodeType {
  description: INodeTypeDescription = {
      displayName: 'Sonos',
      name: 'sonos',
      icon: 'file:sonos.svg',
      group: ['transform'],
      version: 1,
      description: 'Sonos API',
      defaults: {
          name: 'Sonos',
          color: '#222222',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [{
        name: 'sonosOAuth2Api',
        required: true,
      }],
      properties: [
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          options: [
            {
              name: 'Set Playlist',
              value: 'set-playlist',
              description: 'Select and Play a playlist'
            }
          ],
          default: 'set-playlist',
          description: 'The operation to perform.'
        }, {
          displayName: 'Households',
          name: 'household',
          type: 'options',
          typeOptions: {
            loadOptionsMethod: 'loadHouseholds',
          },
          default: '',
          description: 'The household to activate the playlist onto.',
          displayOptions: {
            show: {
              operation: [
                'set-playlist'
              ],
            },
          },
        }, {
          displayName: 'Groups',
          name: 'group',
          type: 'options',
          typeOptions: {
            loadOptionsMethod: 'loadGroups',
            loadOptionsDependsOn: [
              'household',
            ],
          },
          default: '',
          description: 'The group to activate the playlist onto.',
          displayOptions: {
            show: {
              operation: [
                'set-playlist'
              ],
            },
          },
        }, {
          displayName: 'Playlist',
          name: 'playlist',
          type: 'options',
          typeOptions: {
            loadOptionsMethod: 'loadPlaylists',
            loadOptionsDependsOn: [
              'household',
            ],
          },
          default: '',
          description: 'The playslist to activate.',
          displayOptions: {
            show: {
              operation: [
                'set-playlist'
              ],
            },
          },
        }
      ]
  };

  methods = {
		loadOptions: {
			async loadHouseholds(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const responseData = await sonosApiRequest.call(this, 'GET', 'households', {});
				if (responseData === undefined) {
					throw new NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
				}
				return _.map(responseData.households, (item) => ({
					name: item.name || item.id,
					value: item.id,
					description: item.name || item.id,
				}) as INodePropertyOptions);
			},
      async loadGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        let householdID = this.getNodeParameter('household') as string;
        if(!householdID) {
          return [];
        }

				const responseData = await sonosApiRequest.call(this, 'GET', `households/${householdID}/groups`, {});
				if (responseData === undefined) {
					throw new NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
				}
				return _.map(responseData.groups, (item) => ({
					name: item.name,
					value: item.id,
					description: item.name,
				}) as INodePropertyOptions);
			},
      async loadPlaylists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        let householdID = this.getNodeParameter('household') as string;
        if(!householdID) {
          return [];
        }

				const responseData = await sonosApiRequest.call(this, 'GET', `households/${householdID}/playlists`, {});
				if (responseData === undefined) {
					throw new NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
				}
				return _.map(responseData.playlists, (item) => ({
					name: item.name,
					value: item.id,
					description: item.name,
				}) as INodePropertyOptions);
			},
		},
	};

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const operations = this.getNodeParameter('operation', 0) as string;
		const householdID = this.getNodeParameter('household', 0) as string;
    const groupID = this.getNodeParameter('group', 0) as string;
    const playlistID = this.getNodeParameter('playlist', 0) as string;
		const items = this.getInputData();
		for (let i = 0; i < items.length; i++) {
			switch (operations) {
				case 'set-playlist':
					responseData = await sonosApiRequest.call(this, 'POST', `groups/${groupID}/playlists`, {action: 'replace', playlistId: playlistID, playOnCompletion: true});
					break;
				default:
					responseData = [];
					break;
			}
		}
		return [this.helpers.returnJsonArray(responseData)];
	}
}