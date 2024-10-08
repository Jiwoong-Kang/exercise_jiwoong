import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { Provider } from '../../common/enums/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.GOOGLE,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, email, picture, displayName } = profile;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (user.provider !== provider) {
        throw new HttpException(
          `Your email already enrolled in ${provider}`,
          HttpStatus.CONFLICT,
        );
      }
      console.log('+++++++++++++++++++++++');
      done(null, user);
    } catch (err) {
      if (err.status === 404) {
        const newUser = await this.userService.createUser({
          name: displayName,
          email,
          provider,
          profileImg: picture,
        });
        console.log('------------------------');
        done(null, newUser);
      } else if (err.status === 409) {
        throw new HttpException(
          'This email already exists!',
          HttpStatus.CONFLICT,
        );
      }
    }
  }
}
