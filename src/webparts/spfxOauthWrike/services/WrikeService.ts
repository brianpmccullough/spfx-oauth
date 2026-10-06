import { AadHttpClient, type AadHttpClientFactory, type HttpClientResponse } from '@microsoft/sp-http';

import type { IMe } from '../models/IMe';

/**
 * Calls the Entra ID-secured spfx-oauth-api
 * (https://github.com/brianpmccullough/spfx-oauth-api).
 *
 * SPFx acquires the bearer token for `resourceUri` through AadHttpClientFactory;
 * nothing here handles tokens directly.
 */
export class WrikeService {
  private _client: Promise<AadHttpClient> | undefined;

  public constructor(
    private readonly _factory: AadHttpClientFactory,
    private readonly _baseUrl: string,
    private readonly _resourceUri: string
  ) {}

  /**
   * Connectivity smoke test: success proves the SPFx token request, the tenant's
   * API access approval, CORS, and the API's token validation all line up.
   */
  public async getMe(): Promise<IMe> {
    const response = await this._get('me');
    if (!response.ok) {
      throw new Error(`GET /me failed (HTTP ${response.status}).`);
    }
    return response.json();
  }

  private async _get(path: string): Promise<HttpClientResponse> {
    const client = await this._getClient();
    return client.get(this._url(path), AadHttpClient.configurations.v1);
  }

  /** Resolves `path` under the base URL, tolerating a base with or without a trailing slash. */
  private _url(path: string): string {
    const base = this._baseUrl.endsWith('/') ? this._baseUrl : `${this._baseUrl}/`;
    return new URL(path, base).toString();
  }

  private async _getClient(): Promise<AadHttpClient> {
    // Cache the promise, not the client, so concurrent callers share one token request.
    if (!this._client) {
      this._client = this._factory.getClient(this._resourceUri);
    }
    return this._client;
  }
}
