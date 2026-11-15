// Constantes do frontend. Os LIMITS devem ser iguais aos do backend (recipe-master-api/config/constants.js e models).
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
}

export const LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  TITLE_MAX: 150,
  DESCRIPTION_MAX: 2000,
  INGREDIENTS_MAX: 3000,
  INSTRUCTIONS_MAX: 5000,
  BIO_MAX: 255,
  COMMENT_MAX: 500,
}

// Tamanho de página dos feeds. O backend aceita no máximo 50 (PAGINATION.MAX_LIMIT).
export const PAGE_SIZE = 3

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
}

export const MESSAGES = {
  GENERIC_ERROR: 'Ocorreu um erro na requisição.',
  NETWORK_ERROR: 'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente mais tarde.',
  REQUEST_SETUP_ERROR: 'Erro inesperado ao preparar a requisição.',
}
