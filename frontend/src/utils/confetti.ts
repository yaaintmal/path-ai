export async function fireConfetti({
  particleCount = 80,
  spread = 60,
  colors = ['#a78bfa', '#fb7185', '#f97316', '#facc15'],
} = {}) {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({ particleCount, spread, colors });
  } catch (err) {
    // module not installed or error - fail silently
    // fallback: create simple DOM sparkle (optional) - omitted for now
    console.warn('Confetti not available:', err);
  }
}

export default fireConfetti;
