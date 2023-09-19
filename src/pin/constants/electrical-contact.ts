import { EnumItem } from '../../shared/types/enums';
import { ElectricalContactEnum } from '../types/electrical-contact.enum';

export const ELECTRICAL_CONTACT: EnumItem[] = [
  {
    text: 'pin.enums.electrical_contact.' + ElectricalContactEnum.NO,
    value: ElectricalContactEnum.NO,
  },
  {
    text: 'pin.enums.electrical_contact.' + ElectricalContactEnum.NC,
    value: ElectricalContactEnum.NC,
  },
];