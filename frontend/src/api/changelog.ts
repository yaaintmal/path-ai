const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ChangelogEntry {
  version: string;
  date?: string;
  title: string;
  description: string;
  details?: string[];
}

export interface ChangelogResponse {
  success: boolean;
  entries: ChangelogEntry[];
  lastUpdated?: string;
}

export async function fetchChangelog(): Promise<ChangelogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/changelog`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch changelog:', error);
    throw error;
  }
}

export async function fetchLatestChangelog(): Promise<{ entry: ChangelogEntry }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/changelog/latest`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch latest changelog:', error);
    throw error;
  }
}

export async function fetchRecentChangelog(limit = 3): Promise<ChangelogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/changelog/recent?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch recent changelog:', error);
    throw error;
  }
}
