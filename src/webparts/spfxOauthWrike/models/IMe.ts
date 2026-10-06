/** The caller as the API sees them, from GET /me. */
export interface IMe {
  // The API serializes absent claims as JSON null, so the wire type is null.
  // eslint-disable-next-line @rushstack/no-new-null
  upn: string | null;
  // eslint-disable-next-line @rushstack/no-new-null
  name: string | null;
  /** Temporary: the API echoes the access token back to prove it arrived. */
  bearerToken: string;
}
