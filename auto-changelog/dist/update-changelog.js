"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChangelog = void 0;
const assert_1 = require("assert");
const execa_1 = __importDefault(require("execa"));
const parse_changelog_1 = require("./parse-changelog");
const constants_1 = require("./constants");
async function getMostRecentTag() {
    const revListArgs = ['rev-list', '--tags', '--max-count=1', '--date-order'];
    const results = await runCommand('git', revListArgs);
    if (results.length === 0) {
        return null;
    }
    const [mostRecentTagCommitHash] = results;
    const [mostRecentTag] = await runCommand('git', [
        'describe',
        '--tags',
        mostRecentTagCommitHash,
    ]);
    assert_1.strict.equal(mostRecentTag === null || mostRecentTag === void 0 ? void 0 : mostRecentTag[0], 'v', 'Most recent tag should start with v');
    return mostRecentTag;
}
async function getCommits(commitHashes) {
    var _a;
    const commits = [];
    for (const commitHash of commitHashes) {
        const [subject] = await runCommand('git', [
            'show',
            '-s',
            '--format=%s',
            commitHash,
        ]);
        assert_1.strict.ok(Boolean(subject), `"git show" returned empty subject for commit "${commitHash}".`);
        let matchResults = subject.match(/\(#(\d+)\)/u);
        let prNumber;
        let description = subject;
        if (matchResults) {
            // Squash & Merge: the commit subject is parsed as `<description> (#<PR ID>)`
            prNumber = matchResults[1];
            description = ((_a = subject.match(/^(.+)\s\(#\d+\)/u)) === null || _a === void 0 ? void 0 : _a[1]) || '';
        }
        else {
            // Merge: the PR ID is parsed from the git subject (which is of the form `Merge pull request
            // #<PR ID> from <branch>`, and the description is assumed to be the first line of the body.
            // If no body is found, the description is set to the commit subject
            matchResults = subject.match(/#(\d+)\sfrom/u);
            if (matchResults) {
                prNumber = matchResults[1];
                const [firstLineOfBody] = await runCommand('git', [
                    'show',
                    '-s',
                    '--format=%b',
                    commitHash,
                ]);
                description = firstLineOfBody || subject;
            }
        }
        // Otherwise:
        // Normal commits: The commit subject is the description, and the PR ID is omitted.
        commits.push({ prNumber, description });
    }
    return commits;
}
function getAllChangeDescriptions(changelog) {
    const releases = changelog.getReleases();
    const changeDescriptions = Object.values(changelog.getUnreleasedChanges()).flat();
    for (const release of releases) {
        changeDescriptions.push(...Object.values(changelog.getReleaseChanges(release.version)).flat());
    }
    return changeDescriptions;
}
function getAllLoggedPrNumbers(changelog) {
    const changeDescriptions = getAllChangeDescriptions(changelog);
    const prNumbersWithChangelogEntries = [];
    for (const description of changeDescriptions) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const matchResults = description.matchAll(/\[#(\d+)\]/gu);
        const prNumbers = Array.from(matchResults, (result) => result[1]);
        prNumbersWithChangelogEntries.push(...prNumbers);
    }
    return prNumbersWithChangelogEntries;
}
async function getCommitHashesInRange(commitRange, rootDirectory) {
    const revListArgs = ['rev-list', commitRange];
    if (rootDirectory) {
        revListArgs.push(rootDirectory);
    }
    return await runCommand('git', revListArgs);
}
/**
 * Update a changelog with any commits made since the last release. Commits for
 * PRs that are already included in the changelog are omitted.
 * @param options
 * @param options.changelogContent - The current changelog
 * @param options.currentVersion - The current version. Required if
 * `isReleaseCandidate` is set, but optional otherwise.
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @param options.isReleaseCandidate - Denotes whether the current project.
 * is in the midst of release preparation or not. If this is set, any new
 * changes are listed under the current release header. Otherwise, they are
 * listed under the 'Unreleased' section.
 * @param options.projectRootDirectory - The root project directory, used to
 * filter results from various git commands. This path is assumed to be either
 * absolute, or relative to the current directory. Defaults to the root of the
 * current git repository.
 * @returns The updated changelog text
 */
async function updateChangelog({ changelogContent, currentVersion, repoUrl, isReleaseCandidate, projectRootDirectory, }) {
    if (isReleaseCandidate && !currentVersion) {
        throw new Error(`A version must be specified if 'isReleaseCandidate' is set.`);
    }
    const changelog = parse_changelog_1.parseChangelog({ changelogContent, repoUrl });
    // Ensure we have all tags on remote
    await runCommand('git', ['fetch', '--tags']);
    const mostRecentTag = await getMostRecentTag();
    if (isReleaseCandidate && mostRecentTag === `v${currentVersion}`) {
        throw new Error(`Current version already has tag, which is unexpected for a release candidate.`);
    }
    const commitRange = mostRecentTag === null ? 'HEAD' : `${mostRecentTag}..HEAD`;
    const commitsHashesSinceLastRelease = await getCommitHashesInRange(commitRange, projectRootDirectory);
    const commits = await getCommits(commitsHashesSinceLastRelease);
    const loggedPrNumbers = getAllLoggedPrNumbers(changelog);
    const newCommits = commits.filter(({ prNumber }) => prNumber === undefined || !loggedPrNumbers.includes(prNumber));
    const hasUnreleasedChanges = Object.keys(changelog.getUnreleasedChanges()).length !== 0;
    if (newCommits.length === 0 &&
        (!isReleaseCandidate || hasUnreleasedChanges)) {
        return undefined;
    }
    // Ensure release header exists, if necessary
    if (isReleaseCandidate &&
        !changelog
            .getReleases()
            .find((release) => release.version === currentVersion)) {
        // Typecast: currentVersion will be defined here due to type guard at the
        // top of this function.
        changelog.addRelease({ version: currentVersion });
    }
    if (isReleaseCandidate && hasUnreleasedChanges) {
        // Typecast: currentVersion will be defined here due to type guard at the
        // top of this function.
        changelog.migrateUnreleasedChangesToRelease(currentVersion);
    }
    const newChangeEntries = newCommits.map(({ prNumber, description }) => {
        if (prNumber) {
            const suffix = `([#${prNumber}](${repoUrl}/pull/${prNumber}))`;
            return `${description} ${suffix}`;
        }
        return description;
    });
    for (const description of newChangeEntries.reverse()) {
        changelog.addChange({
            version: isReleaseCandidate ? currentVersion : undefined,
            category: constants_1.ChangeCategory.Uncategorized,
            description,
        });
    }
    return changelog.toString();
}
exports.updateChangelog = updateChangelog;
/**
 * Executes a shell command in a child process and returns what it wrote to
 * stdout, or rejects if the process exited with an error.
 *
 * @param command - The command to run, e.g. "git".
 * @param args - The arguments to the command.
 * @returns An array of the non-empty lines returned by the command.
 */
async function runCommand(command, args) {
    return (await execa_1.default(command, [...args])).stdout
        .trim()
        .split('\n')
        .filter((line) => line !== '');
}
//# sourceMappingURL=update-changelog.js.map