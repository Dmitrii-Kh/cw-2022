import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Measurement } from '../entities/measurement.entity';

export const GetMeasurement = createParamDecorator((data, ctx: ExecutionContext): Measurement => {
    try {
        const req = ctx.switchToHttp().getRequest().body.data[0];
        let [stationOrganisationRegistryNumber, stationName] = req.id.split('.');
        return {
            stationName,
            stationOrganisationRegistryNumber,
            ...req,
        };
    } catch (e) {
        throw new BadRequestException(e);
    }
});