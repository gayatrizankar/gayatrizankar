import jsonfile from 'jsonfile'; // For working with JSON files
import moment from 'moment'; // For date manipulation
import simpleGit from 'simple-git'; // For Git operations
import { randomInt } from 'crypto'; // For random number generation

const FILE_PATH = './data.json'; // The path to your data.json file
const git = simpleGit(); // Initialize simple-git
const NUM_COMMITS = 10; // Number of commits to create

// Function to write to data.json
const writeToFile = async (data) => {
  try {
    await jsonfile.writeFile(FILE_PATH, data, { spaces: 2 });
    console.log("✅ Data written to data.json:", data);
  } catch (err) {
    console.error('❌ Error writing to data.json:', err);
  }
};

// Function to make a commit
const makeCommit = async (n) => {
  if (n <= 0) {
    // Once all commits are done, push the changes to the remote repository
    try {
      await git.push('origin', 'main');  // Push to 'main' branch
      console.log('✅ All commits pushed to the remote repository.');
    } catch (err) {
      console.error('❌ Error pushing commits:', err);
    }
    return;
  }

  // Generate random date for commit
  const x = randomInt(0, 54); // Random week offset
  const y = randomInt(0, 7);  // Random day of the week offset

  // Generate a random date within the last year
  const date = moment().subtract(1, 'year').add(x, 'weeks').add(y, 'days').format();

  // Create data object to write into the JSON file
  const data = { date };

  // Write data to data.json
  await writeToFile(data);

  try {
    // Stage the changes (add the file to git)
    await git.add(FILE_PATH);
    // Commit the changes with a custom commit date
    await git.commit(date, { '--date': date });
    console.log(`✅ Commit ${NUM_COMMITS - n + 1} on ${date}`);
    // Recursively make the next commit
    makeCommit(n - 1);
  } catch (err) {
    console.error('❌ Error committing:', err);
  }
};

// Start the process of making commits
makeCommit(NUM_COMMITS);
