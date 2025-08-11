// Judge0 Configuration
export const JUDGE0_CONFIG = {
  // Service selection
  SERVICE: 'rapidapi' as 'rapidapi' | 'railway' | 'local',
  
  // Service URLs
  RAPIDAPI_URL: 'https://judge0-ce.p.rapidapi.com',
  RAILWAY_URL: 'https://worker-production-347a.up.railway.app',
  LOCAL_URL: 'http://localhost:2358',
  
  // RapidAPI credentials
  RAPIDAPI_KEY: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
  RAPIDAPI_HOST: 'judge0-ce.p.rapidapi.com',
};

// Get the current service URL based on configuration
export function getJudge0Url(): string {
  switch (JUDGE0_CONFIG.SERVICE) {
    case 'rapidapi':
      return JUDGE0_CONFIG.RAPIDAPI_URL;
    case 'railway':
      return JUDGE0_CONFIG.RAILWAY_URL;
    case 'local':
      return JUDGE0_CONFIG.LOCAL_URL;
    default:
      return JUDGE0_CONFIG.RAPIDAPI_URL;
  }
}

// Get headers based on service type
export function getJudge0Headers(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (JUDGE0_CONFIG.SERVICE === 'rapidapi') {
    headers['X-RapidAPI-Key'] = JUDGE0_CONFIG.RAPIDAPI_KEY;
    headers['X-RapidAPI-Host'] = JUDGE0_CONFIG.RAPIDAPI_HOST;
  }
  
  return headers;
}
