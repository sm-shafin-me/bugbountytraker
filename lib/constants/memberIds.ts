export const MEMBER_IDS = [
    'AFROREDX6Q9K2',
    'RAHATREDX403T2',
    'REDXF92MQA7LK8Z',
    'REDX8KQ7M2ZA9LF',
    'REDXA9ZK2QF8M7L',
    'REDX6MAQ9KZ2F8L',
    'REDXQ82ZLAM9KF7',
    'REDXZ9F7QKA2LM8',
    'REDXL2A8ZMQ79KF',
    'REDXKF9Q82AZ7LM',
    'REDX7ZAFM9QK28L',
    'REDX29LQFZK8AM7',
] as const;

export type MemberId = typeof MEMBER_IDS[number];

export const isMemberIdValid = (id: string): id is MemberId => {
    return MEMBER_IDS.includes(id as MemberId);
};
