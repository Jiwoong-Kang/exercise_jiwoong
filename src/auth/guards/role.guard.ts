import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';

//canActivate 는 사용자가 이 요청을 할 수 있는지 확인하는 역할을 가진 인터페이스이다
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      // super은 부모 클래스를 가리키므로 RoleGuardMixin and JwtAuthGuard를 포함하는지 확인한다.

      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user = req.user;
      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};
export default RoleGuard;
