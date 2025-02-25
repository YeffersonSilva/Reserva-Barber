// Set para almacenar tokens revocados
const blacklistedTokens = new Set<string>();

export const checkTokenBlacklist = async (token: string): Promise<boolean> => {
  return blacklistedTokens.has(token);
};

export const addToBlacklist = async (token: string): Promise<void> => {
  blacklistedTokens.add(token);
};
