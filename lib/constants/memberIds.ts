export const MEMBER_IDS = [
    'BB-X9R2-ZT',
    'BB-K4W5-PM',
    'BB-Q7L1-VX',
    'BB-N3B8-RD',
    'BB-J6F9-KS',
    'BB-H2M4-TY',
    'BB-G8S5-QL',
    'BB-V1C7-NZ',
    'BB-P5D2-JW',
    'BB-Z9T4-HX',
    'BB-A3L6-MR',
    'BB-S7K1-FP',
] as const;

export type MemberId = typeof MEMBER_IDS[number];

export const isMemberIdValid = (id: string): id is MemberId => {
    return MEMBER_IDS.includes(id as MemberId);
};
