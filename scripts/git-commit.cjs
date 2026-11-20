const { execSync } = require('child_process');

try {
  const addOutput = execSync('git add .', { encoding: 'utf8' });
  console.log('git add done.');
  const commitOutput = execSync('git commit -m "feat: ABHIJITH XS Game Designer Portfolio"', { encoding: 'utf8' });
  console.log(commitOutput);
  const logOutput = execSync('git log -1 --oneline', { encoding: 'utf8' });
  console.log('Latest commit:', logOutput);
} catch (err) {
  console.error('Git error:', err.stdout || err.message);
}
