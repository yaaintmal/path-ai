# Quick Reference: OnboardingWizard Component

## Common Tasks

### Load Saved Onboarding Data

The wizard automatically loads previously saved data from localStorage when the component mounts.

**How it works:**

- On component load, it checks for `onboarddata` in localStorage
- If found, all fields are pre-filled with saved values
- A notification toast shows "Deine gespeicherten Antworten wurden geladen." (Your saved answers were loaded.)
- User can edit and re-save whenever needed

**User flow:**

1. User completes onboarding and saves
2. Data stored in localStorage
3. User returns and opens wizard again
4. All previous answers automatically loaded
5. User can continue editing or start fresh

### Change a Question Text

📁 **File:** `config/learning-config.json` or `config/roles-and-goals.json`

### Add a New Option to a List

📁 **File:** `config/*.json` - Add to the corresponding array

**Example:** Adding a new learning type

```json
{
  "id": "mindmap",
  "label": "Mind Mapping",
  "icon": "🧠"
}
```

### Modify Step Order

📁 **File:** `config/steps.json` - Reorder the array

### Add a Validation Message

📁 **File:** `steps/StepX.tsx` - Add validation logic before saving

### Change Button Text

📁 **File:** `components/NavigationButtons.tsx`

### Add a New Step

1. Add to `config/steps.json` with new ID and icon
2. Create `steps/StepX.tsx` component
3. Import and add conditional render in `OnboardingWizard.tsx`
4. Add new fields to `OnboardingData` interface in `types.ts` if needed

### Adjust Colors

- Steps use: `blue`, `orange`, `green`, `purple`, `yellow`
- Edit in component files or `config/roles-and-goals.json`
- Example: `border-blue-600`, `bg-blue-50`, `dark:bg-blue-900/20`

## File Purposes

| File                               | Purpose                                                |
| ---------------------------------- | ------------------------------------------------------ |
| `OnboardingWizard.tsx`             | Main component, state management, renders steps        |
| `types.ts`                         | TypeScript interfaces (OnboardingData, etc.)           |
| `config/steps.json`                | Step flow definition                                   |
| `config/roles-and-goals.json`      | Roles, goals, and related options                      |
| `config/learning-config.json`      | Learning types, schedules, gamification, communication |
| `components/ProgressBar.tsx`       | Visual step indicator                                  |
| `components/NavigationButtons.tsx` | Previous/Next/Complete buttons                         |
| `components/Headers.tsx`           | Reusable header components                             |
| `components/SummaryDialog.tsx`     | Final summary modal                                    |
| `steps/Step*.tsx`                  | Individual step UI and logic                           |

## Import Patterns

```tsx
// Import main component
import { OnboardingWizard } from './components/landing/onboarding';

// Import type
import type { OnboardingData } from './components/landing/onboarding';

// Import from config
import stepsConfig from './config/steps.json';
import rolesData from './config/roles-and-goals.json';
import learningConfig from './config/learning-config.json';
```

## Data Structure

```tsx
interface OnboardingData {
  role: string; // 'student', 'pupil', 'teacher'
  level: string; // E.g., "3. Semester", "8. Klasse"
  goals: string[]; // Selected goals
  subjects: string[]; // E.g., ["Mathematik", "Englisch"]
  skillLevels: Record<string, number>; // {subject: 1-5}
  learningType: string[]; // Selected learning types
  weeklyHours: number; // 1-40 hours
  schedule: string; // 'fixed', 'flexible', 'mixed'
  bestTime: string[]; // Time slots (morning, afternoon, etc.)
  gamification: string; // 'full', 'light', 'none'
  rewards: string[]; // Selected reward types
  communicationStyle: string; // Communication style ID
}
```

## Component Props Pattern

```tsx
// Step component props
interface StepXProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
  toggleArrayItem?: (field: keyof OnboardingData, item: string) => void;
}

export function StepX({ data, updateData, toggleArrayItem }: StepXProps) {
  // Implementation
}
```

## Saving Data

Data is automatically saved to localStorage when user completes the wizard:

```tsx
localStorage.setItem('onboarddata', JSON.stringify(data));
```

To retrieve: `JSON.parse(localStorage.getItem('onboarddata'))`

## Dark Mode Classes

All components support dark mode:

```
dark:text-white        // White text in dark mode
dark:bg-gray-800       // Dark background
dark:border-gray-700   // Dark border
dark:bg-blue-900/20    // Semi-transparent colored bg
```

## Lucide Icons Used

```
GraduationCap, BookOpen, Users, Target, Brain,
Clock, Gamepad2, MessageSquare, ArrowRight, ArrowLeft,
Check, Sparkles
```

See: https://lucide.dev/

## Testing Modifications

1. Check that icons exist in lucide-react
2. Verify color names (Tailwind classes)
3. Test dark mode: `Toggle Developer Tools → Styles → prefers-color-scheme: dark`
4. Test mobile responsiveness
5. Check localStorage after completing wizard: `localStorage.getItem('onboarddata')`

## Common Errors & Solutions

| Error                   | Solution                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Icon not showing        | Verify icon name in steps.json matches lucide-react exports   |
| Color not working       | Use Tailwind color values (blue, orange, etc.)                |
| Data not saving         | Check browser localStorage is enabled                         |
| Type errors             | Update OnboardingData interface in types.ts                   |
| Component not rendering | Check conditional in OnboardingWizard.tsx matches currentStep |
