import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SonosOAuth2Api implements ICredentialType {
	name = 'sonosOAuth2Api';
	extends = [
		'oAuth2Api',
	];
	displayName = 'Sonos OAuth2 API';
	documentationUrl = 'sonos';
	properties: INodeProperties[] = [
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api.sonos.com/login/v3/oauth',
      required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.sonos.com/login/v3/oauth/access',
      required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'playback-control-all',
		},
    {
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
			description: 'Method of authentication.',
		},
	];
}
