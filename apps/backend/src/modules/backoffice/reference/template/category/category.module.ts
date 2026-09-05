import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CategoryTemplate } from './category.entity';
import { CategoryTemplateService } from './category.service';

@Module({
    imports: [MikroOrmModule.forFeature([CategoryTemplate])],
    providers: [CategoryTemplateService],
    exports: [CategoryTemplateService],
})
export class CategoryTemplateModule {}
