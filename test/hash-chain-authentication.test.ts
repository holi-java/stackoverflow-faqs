issue("hash chain authentication"
    , "https://en.wikipedia.org/wiki/Hash_chain")
describe("hash chain authentication", () => {
    function hash(token: string, times: number = 1): string {
        return token.replace(/^(token-.*?:)(\d+)|(.*)$/, (_, g1, g2, g3) => {
            return g2 ? `${g1}${+g2 + times}` : `token-${g3}:${times}`;
        });
    }

    class Authentication {
        private token: string;

        constructor(password: string) {
            this.token = hash(password, 1000);
        }

        verify(token: string): boolean {
            return hash(token) == this.token && (this.token = token, true);
        }
    }


    let auth;
    beforeEach(() => auth = new Authentication("foo"));

    test("verify failed with un-hashed password", () => {
        expect(auth.verify("foo")).toBe(false);
    });

    test("verify success when user supplies h999(password)", () => {
        expect(auth.verify(hash("foo", 999))).toBe(true);
    });

    test("user can't be use same token twice", () => {
        expect(auth.verify(hash("foo", 999))).toBe(true);
        expect(auth.verify(hash("foo", 999))).toBe(false);
    });

    test("server saves the last valid token", () => {
        expect(auth.verify(hash("foo", 999))).toBe(true);
        expect(auth.verify(hash("foo", 998))).toBe(true);
    });

    test("don't update server token when verify failed", () => {
        expect(auth.verify("bad")).toBe(false);
        expect(auth.verify(hash("foo", 999))).toBe(true);
    });
});