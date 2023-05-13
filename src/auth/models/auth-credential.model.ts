import { AuthCredentialsInterface } from '../types/auth-credentials.interface';
import { TokensInterface } from '../types/tokens.interface';
import { User } from '../users/user.entity';

export class AuthCredentialModel implements AuthCredentialsInterface {
  public id: number;
  public email: string;
  public access_token: string;
  public refresh_token: string;

  static create(tokens: TokensInterface, user: User): AuthCredentialsInterface {
    const authCredential = new AuthCredentialModel();
    authCredential.access_token = tokens.access_token;
    authCredential.refresh_token = tokens.refresh_token;
    authCredential.email = user.email;
    authCredential.id = user.id;

    return authCredential;
  }
}
