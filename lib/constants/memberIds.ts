export const MEMBER_IDS = [
    'AFROredX6Q9K2',
    'redXRahatT4031',
    'redXF92MQA7LK8Z',
    'redX8KQ7M2ZA9LF',
    'redXA9ZK2QF8M7L',
    'redX6MAQ9KZ2F8L',
    'redXQ82ZLAM9KF7',
    'redXZ9F7QKA2LM8',
    'redXL2A8ZMQ79KF',
    'redXKF9Q82AZ7LM',
    'redX7ZAFM9QK28L',
    'redX29LQFZK8AM7',
] as const;

export type MemberId = typeof MEMBER_IDS[number];

export const isMemberIdValid = (id: string): id is MemberId => {
    return MEMBER_IDS.includes(id as MemberId);
};
