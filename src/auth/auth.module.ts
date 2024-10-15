import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Ensure this path is correct
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule), // Use forwardRef here if there's a circular dependency
    PassportModule,
    JwtModule.register({
      secret: 'amongus', // Replace with a stronger secret
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService
})
export class AuthModule {}
