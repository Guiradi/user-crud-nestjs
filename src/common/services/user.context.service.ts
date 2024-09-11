import { Injectable, Scope } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
  private user: User;

  setUser(user: User): void {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }
}
