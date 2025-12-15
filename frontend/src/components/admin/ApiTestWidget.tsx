import { useState } from 'react';
import { getApiUrl } from '../../config/app.config';

export function ApiTestWidget() {
  const [apiTestResult, setApiTestResult] = useState<string>('');

  const testApiConnection = async () => {
    try {
      const url = getApiUrl('/api/health');
      const response = await fetch(url);
      const data = await response.json();
      setApiTestResult(`✅ Success: ${JSON.stringify(data)}`);
    } catch (error) {
      setApiTestResult(`❌ Error: ${String(error)}`);
    }
  };

  const testLoginEndpoint = async () => {
    try {
      const url = getApiUrl('/api/users/login');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test' }),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await response.json();
      setApiTestResult(`🔐 Login test: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setApiTestResult(`❌ Login test error: ${String(error)}`);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">🔧 Debug: API Connection Test</h3>
      <div className="flex gap-2 mb-2">
        <button
          onClick={testApiConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Health Endpoint
        </button>
        <button
          onClick={testLoginEndpoint}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Login Endpoint
        </button>
      </div>
      <div className="text-sm text-muted mt-2">
        <div>
          Computed API baseUrl: <code>{getApiUrl('')}</code>
        </div>
      </div>
      {apiTestResult && (
        <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded text-sm font-mono">
          {apiTestResult}
        </div>
      )}
    </div>
  );
}

export default ApiTestWidget;
