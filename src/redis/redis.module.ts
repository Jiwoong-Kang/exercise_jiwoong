import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/common/cache';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        return {
          store: redisStore,
          host: cfg.get('REDIS_HOST'),
          port: cfg.get('REDIS_PORT'),
          username: cfg.get('REDIS_USER'),
          password: cfg.get('REDIS_PASSWORD'),
          ttl: cfg.get('REDIS_TTL'),
        };
      },
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}
