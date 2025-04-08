import { MikroORM } from "@mikro-orm/sqlite";
import { NewsletterMembership } from "./entities/NewsletterMembership";
import { User } from "./entities/User";
import { Newsletter } from "./entities/Newsletter";
import { NewsletterIssue } from "./entities/NewsletterIssue";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ":memory:",
    entities: [Newsletter, NewsletterIssue, NewsletterMembership, User],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

let user: User;
let newsletter: Newsletter;
let issue: NewsletterIssue;

beforeEach(async () => {
  user = orm.em.create(User, { name: "Foo", email: "foo" });

  newsletter = orm.em.create(Newsletter, { name: "The Newsletter" });
  issue = orm.em.create(NewsletterIssue, { title: "Issue #1", newsletter });
  orm.em.create(NewsletterMembership, { newsletter, user });

  await orm.em.flush();
  orm.em.clear();

  orm.em.setFilterParams("newsletterUser", { userId: user.id });
  orm.em.setFilterParams("newsletterIssueUser", { userId: user.id });
});

afterEach(async () => {
  orm.em.remove(user);
  await orm.em.flush();
});

describe('with `fields: ["id"]`', () => {
  const fields = ["id"] as const;

  test("with both filters active", async () => {
    // FAILS with: DriverException: Cannot read properties of undefined (reading 'findIndex')
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: true, newsletterIssueUser: true } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterUser` filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: true, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterIssueUser` filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: false, newsletterIssueUser: true } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with neither filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: false, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterUser` filter active plus explicit query", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: true, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });
});

describe('with `fields: ["*"]`', () => {
  const fields = ["*"] as const;

  test("with both filters active", async () => {
    // FAILS with: DriverException: Cannot read properties of undefined (reading 'findIndex')
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: true, newsletterIssueUser: true } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterUser` filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: true, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterIssueUser` filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: false, newsletterIssueUser: true } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with neither filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { fields, filters: { newsletterUser: false, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });
});

describe("fields not given", () => {
  test("with both filters active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { filters: { newsletterUser: true, newsletterIssueUser: true } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterUser` filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { filters: { newsletterUser: true, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with only `newsletterIssueUser` filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { filters: { newsletterUser: false, newsletterIssueUser: true } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });

  test("with neither filter active", async () => {
    const issue1 = await orm.em.findOneOrFail(
      NewsletterIssue,
      { id: issue.id },
      { filters: { newsletterUser: false, newsletterIssueUser: false } }
    );
    expect(issue1).toEqual(expect.objectContaining({ id: issue.id }));
  });
});

test("selecting newsletter", async () => {
  const newsletter1 = await orm.em.findOneOrFail(
    Newsletter,
    { id: newsletter.id },
    {
      fields: ["id"],
      populate: ["issues"],
      filters: { newsletterUser: true, newsletterIssueUser: true },
    }
  );
  expect(newsletter1).toEqual(expect.objectContaining({ id: newsletter.id }));
});
