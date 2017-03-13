const noop = () => {};
Object.assign(global, {
    /**
     * Annotation for issues
     * @param title
     * @param url
     */
    issue: noop
});