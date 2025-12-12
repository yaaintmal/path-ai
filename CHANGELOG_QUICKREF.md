# Changelog Handler - Quick Reference

## How to Add a New Version to the Changelog

### Step 1: Update the Frontend Version

Edit `frontend/src/version.ts`:

```typescript
// Add comment at the top with your new version
// version X.X.X.X: your change title

// Update the APP_VERSION constant
export const APP_VERSION = 'X.X.X.X';
export const LAST_UPDATED = 'YYYY-MM-DD'; // Today's date
```

### Step 2: Add Entry to Changelog Controller

Edit `backend/src/controllers/changelogController.ts` in the `parseChangelogEntries()` function.

Add your new entry at the **top** of the entries array (most recent first):

```typescript
function parseChangelogEntries(): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [
    {
      version: '0.5.2.0', // Your new version
      date: '2025-12-12', // Today
      title: 'Feature title', // Short title (3-5 words)
      description: 'What was added/changed', // One sentence summary
      details: [
        'Detail point 1',
        'Detail point 2',
        'Detail point 3',
        // Add up to 4-5 bullet points
      ],
    },
    // ... existing entries below ...
  ];
  return entries;
}
```

### Step 3: Deploy

1. Commit your changes to git
2. Push to main branch
3. Backend and frontend will both display the new version automatically

## Data Structure

```typescript
interface ChangelogEntry {
  version: string; // e.g., "0.5.2.0"
  date?: string; // e.g., "2025-12-12"
  title: string; // Short title
  description: string; // One-line description
  details?: string[]; // Array of 2-5 bullet points
}
```

## Tips

- **Version numbering**: Use semantic versioning (MAJOR.MINOR.PATCH.BUILD)
- **Ordering**: Most recent version always goes first in the array
- **Details**: Keep each detail concise (one sentence max)
- **Title**: Make it clear and concise (3-5 words ideal)
- **Date format**: Always use `YYYY-MM-DD`

## Example: Full Entry

```typescript
{
  version: '0.5.2.1',
  date: '2025-12-12',
  title: 'Changelog feature added',
  description: 'New changelog page with version tracking',
  details: [
    'Clickable version indicator in footer',
    'Beautiful changelog page with widgets',
    'Backend API endpoints for changelog data',
    'Responsive design matching dashboard',
  ],
}
```

## API Endpoints

After deployment, the changelog is accessible via:

- `GET /api/changelog` - All versions
- `GET /api/changelog/latest` - Latest version only
- `GET /api/changelog/recent?limit=3` - Recent versions (default 3)

## Frontend Display

Users can:

1. Click the version indicator (bottom-right corner)
2. View the changelog page with:
   - **Main widget**: Latest version with full details
   - **Small widgets**: Current version, recent releases, stats
   - **Full list**: All versions with sortable details

---

**Note**: The changelog is hardcoded in `changelogController.ts`. For future scalability, consider:

- Reading from a `CHANGELOG.md` file
- Git history integration
- Database storage for enterprise deployments
