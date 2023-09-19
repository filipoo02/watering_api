import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {Esp8266PinoutEnum} from "../types/esp8266-pinout.enum";
import {i18nValidationMessage} from "nestjs-i18n";
import {ElectricalContactEnum} from "../types/electrical-contact.enum";
import {Device} from "../../device/device.entity";

export class CreatePinDto {
    @IsNotEmpty({ message: i18nValidationMessage('')})
    @IsEnum(Esp8266PinoutEnum)
    pinNumber: Esp8266PinoutEnum;

    @IsNotEmpty({ message: i18nValidationMessage('')})
    @IsEnum(ElectricalContactEnum)
    electricalContact: ElectricalContactEnum;

    @IsNotEmpty()
    @IsString()
    device: Device;
}