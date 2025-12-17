const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ChangelogEntry {
  version: string;
  date?: string;
  title: string;
  description: string;
  details?: string[];
}

export interface ChangelogResponse {
  entries: ChangelogEntry[];
}


export async function fetchChangelog(): Promise<ChangelogEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/changelog`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // The backend now returns an array directly
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch changelog:', error);
    throw error;
  }
}

// Remove fetchRecentChangelog as the endpoint is not implemented in the backend controller

export async function fetchLatestChangelog(): Promise<ChangelogEntry> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/changelog/latest`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // The backend now returns the entry directly, not wrapped in an object
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch latest changelog:', error);
    throw error;
  }
}
