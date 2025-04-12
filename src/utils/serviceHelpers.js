export const SERVICE_NAME_TO_ID = {
  Internetas: '532f4c0e-99cd-4c25-a78e-991dc19870eb',
  IPTV: 'a56aca47-70f1-480f-9029-e8ef82e7e11b',
};

export function getServiceIdFromName(name) {
  return SERVICE_NAME_TO_ID[name];
}

export const SERVICE_TYPES = ['Internetas', 'IPTV'];

export const TASK_TYPES = [
  'Skambutis',
  'Problema',
  'Nauja Paslauga',
  'Sutarties Atnaujinimas',
  'Kita',
  'Sutarties Nutraukimas',
];

export const TASK_STATUSES = ['Uždaryta', 'Atviras', 'Atšaukta', 'Vykdomas'];
