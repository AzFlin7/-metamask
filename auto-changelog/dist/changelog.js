"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const constants_1 = require("./constants");
const changelogTitle = '# Changelog';
const changelogDescription = `All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`;
// Stringification helpers
function stringifyCategory(category, changes) {
    const categoryHeader = `### ${category}`;
    if (changes.length === 0) {
        return categoryHeader;
    }
    const changeDescriptions = changes
        .map((description) => `- ${description}`)
        .join('\n');
    return `${categoryHeader}\n${changeDescriptions}`;
}
function stringifyRelease(version, categories, { date, status } = {}) {
    const releaseHeader = `## [${version}]${date ? ` - ${date}` : ''}${status ? ` [${status}]` : ''}`;
    const categorizedChanges = constants_1.orderedChangeCategories
        .filter((category) => categories[category])
        .map((category) => {
        const changes = categories[category];
        return stringifyCategory(category, changes);
    })
        .join('\n\n');
    if (categorizedChanges === '') {
        return releaseHeader;
    }
    return `${releaseHeader}\n${categorizedChanges}`;
}
function stringifyReleases(releases, changes) {
    const stringifiedUnreleased = stringifyRelease(constants_1.unreleased, changes[constants_1.unreleased]);
    const stringifiedReleases = releases.map(({ version, date, status }) => {
        const categories = changes[version];
        return stringifyRelease(version, categories, { date, status });
    });
    return [stringifiedUnreleased, ...stringifiedReleases].join('\n\n');
}
function withTrailingSlash(url) {
    return url.endsWith('/') ? url : `${url}/`;
}
function getCompareUrl(repoUrl, firstRef, secondRef) {
    return `${withTrailingSlash(repoUrl)}compare/${firstRef}...${secondRef}`;
}
function getTagUrl(repoUrl, tag) {
    return `${withTrailingSlash(repoUrl)}releases/tag/${tag}`;
}
function stringifyLinkReferenceDefinitions(repoUrl, releases) {
    // A list of release versions in descending SemVer order
    const descendingSemverVersions = releases
        .map(({ version }) => version)
        .sort((a, b) => {
        return semver_1.default.gt(a, b) ? -1 : 1;
    });
    const latestSemverVersion = descendingSemverVersions[0];
    // A list of release versions in chronological order
    const chronologicalVersions = releases.map(({ version }) => version);
    const hasReleases = chronologicalVersions.length > 0;
    // The "Unreleased" section represents all changes made since the *highest*
    // release, not the most recent release. This is to accomodate patch releases
    // of older versions that don't represent the latest set of changes.
    //
    // For example, if a library has a v2.0.0 but the v1.0.0 release needed a
    // security update, the v1.0.1 release would then be the most recent, but the
    // range of unreleased changes would remain `v2.0.0...HEAD`.
    //
    // If there have not been any releases yet, the repo URL is used directly as
    // the link definition.
    const unreleasedLinkReferenceDefinition = `[${constants_1.unreleased}]: ${hasReleases
        ? getCompareUrl(repoUrl, `v${latestSemverVersion}`, 'HEAD')
        : withTrailingSlash(repoUrl)}`;
    // The "previous" release that should be used for comparison is not always
    // the most recent release chronologically. The _highest_ version that is
    // lower than the current release is used as the previous release, so that
    // patch releases on older releases can be accomodated.
    const releaseLinkReferenceDefinitions = releases
        .map(({ version }) => {
        let diffUrl;
        if (version === chronologicalVersions[chronologicalVersions.length - 1]) {
            diffUrl = getTagUrl(repoUrl, `v${version}`);
        }
        else {
            const versionIndex = chronologicalVersions.indexOf(version);
            const previousVersion = chronologicalVersions
                .slice(versionIndex)
                .find((releaseVersion) => {
                return semver_1.default.gt(version, releaseVersion);
            });
            diffUrl = previousVersion
                ? getCompareUrl(repoUrl, `v${previousVersion}`, `v${version}`)
                : getTagUrl(repoUrl, `v${version}`);
        }
        return `[${version}]: ${diffUrl}`;
    })
        .join('\n');
    return `${unreleasedLinkReferenceDefinition}\n${releaseLinkReferenceDefinitions}${releases.length > 0 ? '\n' : ''}`;
}
/**
 * A changelog that complies with the
 * ["Keep a Changelog" v1.1.0 guidelines](https://keepachangelog.com/en/1.0.0/).
 *
 * This changelog starts out completely empty, and allows new releases and
 * changes to be added such that the changelog remains compliant at all times.
 * This can be used to help validate the contents of a changelog, normalize
 * formatting, update a changelog, or build one from scratch.
 */
class Changelog {
    /**
     * Construct an empty changelog
     *
     * @param options
     * @param options.repoUrl - The GitHub repository URL for the current project
     */
    constructor({ repoUrl }) {
        this._releases = [];
        this._changes = { [constants_1.unreleased]: {} };
        this._repoUrl = repoUrl;
    }
    /**
     * Add a release to the changelog.
     *
     * @param options
     * @param options.addToStart - Determines whether the change is added to the
     * top or bottom of the list of changes in this category. This defaults to
     * `true` because changes should be in reverse-chronological order. This
     * should be set to `false` when parsing a changelog top-to-bottom.
     * @param options.date - An ISO-8601 formatted date, representing the release
     * date.
     * @param options.status - The status of the release (e.g. 'WITHDRAWN',
     * 'DEPRECATED')
     * @param options.version - The version of the current release, which should
     * be a [SemVer](https://semver.org/spec/v2.0.0.html)-compatible version.
     */
    addRelease({ addToStart = true, date, status, version }) {
        if (!version) {
            throw new Error('Version required');
        }
        else if (semver_1.default.valid(version) === null) {
            throw new Error(`Not a valid semver version: '${version}'`);
        }
        else if (this._changes[version]) {
            throw new Error(`Release already exists: '${version}'`);
        }
        this._changes[version] = {};
        const newRelease = { version, date, status };
        if (addToStart) {
            this._releases.unshift(newRelease);
        }
        else {
            this._releases.push(newRelease);
        }
    }
    /**
     * Add a change to the changelog.
     *
     * @param options
     * @param options.addToStart - Determines whether the change is added to the
     * top or bottom of the list of changes in this category. This defaults to
     * `true` because changes should be in reverse-chronological order. This
     * should be set to `false` when parsing a changelog top-to-bottom.
     * @param options.category - The category of the change.
     * @param options.description - The description of the change.
     * @param options.version - The version this change was released in. If this
     * is not given, the change is assumed to be unreleased.
     */
    addChange({ addToStart = true, category, description, version, }) {
        if (!category) {
            throw new Error('Category required');
        }
        else if (!constants_1.orderedChangeCategories.includes(category)) {
            throw new Error(`Unrecognized category: '${category}'`);
        }
        else if (!description) {
            throw new Error('Description required');
        }
        else if (version !== undefined && !this._changes[version]) {
            throw new Error(`Specified release version does not exist: '${version}'`);
        }
        const release = version
            ? this._changes[version]
            : this._changes[constants_1.unreleased];
        if (!release[category]) {
            release[category] = [];
        }
        if (addToStart) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            release[category].unshift(description);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            release[category].push(description);
        }
    }
    /**
     * Migrate all unreleased changes to a release section.
     *
     * Changes are migrated in their existing categories, and placed above any
     * pre-existing changes in that category.
     *
     * @param version - The release version to migrate unreleased changes to.
     */
    migrateUnreleasedChangesToRelease(version) {
        const releaseChanges = this._changes[version];
        if (!releaseChanges) {
            throw new Error(`Specified release version does not exist: '${version}'`);
        }
        const unreleasedChanges = this._changes[constants_1.unreleased];
        for (const category of Object.keys(unreleasedChanges)) {
            if (releaseChanges[category]) {
                releaseChanges[category] = [
                    ...unreleasedChanges[category],
                    ...releaseChanges[category],
                ];
            }
            else {
                releaseChanges[category] = unreleasedChanges[category];
            }
        }
        this._changes[constants_1.unreleased] = {};
    }
    /**
     * Gets the metadata for all releases.
     *
     * @returns The metadata for each release.
     */
    getReleases() {
        return this._releases;
    }
    /**
     * Gets the release of the given version.
     *
     * @param version - The version of the release to retrieve.
     * @returns The specified release, or undefined if no such release exists.
     */
    getRelease(version) {
        return this.getReleases().find(({ version: _version }) => _version === version);
    }
    /**
     * Gets the stringified release of the given version.
     * Throws an error if no such release exists.
     *
     * @param version - The version of the release to stringify.
     * @returns The stringified release, as it appears in the changelog.
     */
    getStringifiedRelease(version) {
        const release = this.getRelease(version);
        if (!release) {
            throw new Error(`Specified release version does not exist: '${version}'`);
        }
        const releaseChanges = this.getReleaseChanges(version);
        return stringifyRelease(version, releaseChanges, release);
    }
    /**
     * Gets the changes in the given release, organized by category.
     *
     * @param version - The version of the release being retrieved.
     * @returns The changes included in the given released.
     */
    getReleaseChanges(version) {
        return this._changes[version];
    }
    /**
     * Gets all changes that have not yet been released
     *
     * @returns The changes that have not yet been released.
     */
    getUnreleasedChanges() {
        return this._changes[constants_1.unreleased];
    }
    /**
     * The stringified changelog, formatted according to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
     *
     * @returns The stringified changelog.
     */
    toString() {
        return `${changelogTitle}
${changelogDescription}

${stringifyReleases(this._releases, this._changes)}

${stringifyLinkReferenceDefinitions(this._repoUrl, this._releases)}`;
    }
}
exports.default = Changelog;
//# sourceMappingURL=changelog.js.map