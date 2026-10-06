import * as React from 'react';
import styles from './SpfxOauthWrike.module.scss';
import type { ISpfxOauthWrikeProps } from './ISpfxOauthWrikeProps';
import type { IMe } from '../models/IMe';
import { escape } from '@microsoft/sp-lodash-subset';
import welcomeDark from '../assets/welcome-dark.png';
import welcomeLight from '../assets/welcome-light.png';

interface ISpfxOauthWrikeState {
  me?: IMe;
  error?: string;
}

export default class SpfxOauthWrike extends React.Component<ISpfxOauthWrikeProps, ISpfxOauthWrikeState> {
  public state: ISpfxOauthWrikeState = {};

  public componentDidMount(): void {
    this.props.wrikeService
      .getMe()
      .then(me => this.setState({ me, error: undefined }))
      .catch((error: Error) => this.setState({ me: undefined, error: error.message }));
  }

  public render(): React.ReactElement<ISpfxOauthWrikeProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.spfxOauthWrike}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? welcomeDark : welcomeLight} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>API: GET /me</h3>
          {this._renderMe()}
        </div>
      </section>
    );
  }

  private _renderMe(): React.ReactElement {
    const { me, error } = this.state;

    if (error) {
      return <div role="alert">{error}</div>;
    }
    if (!me) {
      return <div>Calling the API…</div>;
    }
    return (
      <dl>
        <dt>UPN</dt>
        <dd>{me.upn ?? '(none)'}</dd>
        <dt>Name</dt>
        <dd>{me.name ?? '(none)'}</dd>
        <dt>Bearer token</dt>
        <dd>
          <details>
            <summary>{me.bearerToken.length} characters (paste into jwt.ms to inspect)</summary>
            <pre className={styles.token}>{me.bearerToken}</pre>
          </details>
        </dd>
      </dl>
    );
  }
}
