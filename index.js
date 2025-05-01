import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import { randomInt } from 'crypto'; // For randomness

const FILE_PATH = './data.json';
const git = simpleGit();
const NUM_COMMITS = 10;

const makeCommit = async (n) => {
  if (n <= 0) {
    // Push to remote when all commits are done
    try {
      await git.push('origin', 'main');  // Push to your 'main' branch
      console.log('✅ All commits pushed to the remote repository.');
    } catch (err) {
      console.error('❌ Error pushing commits:', err);
    }
    return;
  }

  const x = randomInt(0, 54); // Random week
  const y = randomInt(0, 7);  // Random day of the week

  const date = moment().subtract(1, 'year').add(x, 'weeks').add(y, 'days').format();

  const data = { date };

  jsonfile.writeFile(FILE_PATH, data, async () => {
    try {
      await git.add(FILE_PATH);
      await git.commit(date, { '--date': date });
      console.log(`✅ Commit ${NUM_COMMITS - n + 1} on ${date}`);
      makeCommit(n - 1);
    } catch (err) {
      console.error('❌ Error committing:', err);
    }
  });
};

makeCommit(NUM_COMMITS);
