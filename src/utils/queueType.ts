export const isQueueIdCorrect = (id: number) => {
  return (
    id == 420 || id == 430 || id == 440 || id == 450 || id == 400 || id == 0
  );
};

export const getQueueName = (id: number): string => {
  let value: string;

  // Not working ..
  // switch (id) {
  //     case 420: value = 'RANKED_SOLO_5x5';
  //         break;
  //     case 440: value = 'RANKED_FLEX_SR';
  //         break;
  //     case 430: value = 'NORMAL_BLIND_PICK';
  //         break;
  //     case 400: value = 'NORMAL_DRAFT_PICK';
  //         break;
  //     case 450: value = 'ARAM';
  //         break;
  //     case 0: value = 'ALL';
  //         break;
  // }

  if (id == 420) {
    value = 'RANKED_SOLO_5x5';
  } else {
    if (id == 440) {
      value = 'RANKED_FLEX_SR';
    } else {
      if (id == 430) {
        value = 'NORMAL_BLIND_PICK';
      } else {
        if (id == 400) {
          value = 'NORMAL_DRAFT_PICK';
        } else {
          if (id == 450) {
            value = 'ARAM';
          } else {
            if (id == 0) {
              value = 'ALL';
            } else {
              if (id == 900) {
                value = 'URF';
              }
            }
          }
        }
      }
    }
  }
  return value;
};

export function getRegionName(region: string): string | null {
  region = region.toUpperCase();
  let response: string | null;
  switch (region) {
    case 'BR1':
    case 'LA1':
    case 'LA2':
    case 'NA1':
      response = 'americas';
      break;
    case 'EUN1':
    case 'EUW1':
      response = 'europe';
      break;
    case 'JP1':
    case 'KR':
    case 'RU':
    case 'PH2':
    case 'TR1':
    case 'TH2':
    case 'SG2':
    case 'TW2':
    case 'VN2':
      response = 'asia';
      break;
    case 'OC1':
      response = 'SEA';
      break;
    default:
      response = null;
      break;
  }
  return response;
}
