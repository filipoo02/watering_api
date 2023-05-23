import { Injectable } from '@nestjs/common';
import { SeederAbstractService } from '../../seeder-abstract.service';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class UserSeederService extends SeederAbstractService {
  data: { email: string; password: string }[] = [
    {
      email: 'test@example.com',
      password: 'password1234',
    },
  ];

  constructor(private authService: AuthService) {
    super();
  }

  async seed(): Promise<void> {
    return new Promise((resolve) => {
      this.data.forEach((u, i, arr) => {
        const lastOne = i === arr.length - 1;

        this.authService
          .singup(u.email, u.password, 'en')
          .then(() => {
            console.log(
              '\x1b[32m [SEEDER] User added to the database. \x1b[0m',
            );
            if (lastOne) {
              resolve();
            }
          })
          .catch((err) => {
            console.log(
              '\x1b[31m',
              '[SEEDER] Something went wrong with adding user to the database.',
            );

            console.error(err);
          });
      });
    });
  }
}
